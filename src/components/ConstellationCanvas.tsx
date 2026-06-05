"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface APINode {
  id: string;
  name: string;
  slug: string;
  weight: number;
}

interface APILink {
  source: string;
  target: string;
  strength: number;
}

interface PhysicsNode extends APINode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  targetGlow: number;
  currentGlow: number;
}

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    weight: number;
    visible: boolean;
  }>({ x: 0, y: 0, name: "", weight: 0, visible: false });

  // Use refs to store physics state to avoid React re-renders on animation frame
  const nodesRef = useRef<PhysicsNode[]>([]);
  const linksRef = useRef<APILink[]>([]);
  const mouseRef = useRef<{ x: number; y: number; hoveredNodeId: string | null }>({
    x: -9999,
    y: -9999,
    hoveredNodeId: null,
  });

  useEffect(() => {
    let active = true;

    async function fetchNetworkData() {
      try {
        const response = await fetch("/api/network");
        if (!response.ok) {
          throw new Error("Failed to fetch constellation data.");
        }
        const data = await response.json();
        
        if (!active) return;

        // Initialize node physics properties
        const initializedNodes = data.nodes.map((node: APINode, index: number) => {
          // Determine color based on index
          const color = index % 2 === 0 ? "#00f2fe" : "#8b5cf6"; // Alternating cosmic-teal and cosmic-purple
          
          // Radius scales with weight: base radius 8px + weight * 3px, capped at 30px
          const radius = Math.min(8 + node.weight * 3, 30);

          // Random starting positions inside container dimensions
          const containerWidth = containerRef.current?.clientWidth || 800;
          const containerHeight = containerRef.current?.clientHeight || 450;
          
          return {
            ...node,
            x: Math.random() * (containerWidth - 60) + 30,
            y: Math.random() * (containerHeight - 60) + 30,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius,
            color,
            targetGlow: 0,
            currentGlow: 0,
          };
        });

        nodesRef.current = initializedNodes;
        linksRef.current = data.links;
        setLoading(false);
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load data.");
          setLoading(false);
        }
      }
    }

    fetchNetworkData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || error || nodesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Handle high DPI screens
    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 800;
      const height = rect?.height || 450;
      const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Main animation loop
    const render = () => {
      const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const links = linksRef.current;
      const mouse = mouseRef.current;

      // --- Physics Update ---
      // 1. Gravity / Central attraction
      const gravity = 0.005;
      for (const node of nodes) {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * gravity * 0.05;
        node.vy += dy * gravity * 0.05;
      }

      // 2. Pairwise Repulsion
      const repulsion = 0.8;
      const minDistance = 100;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < minDistance) {
            const force = ((minDistance - dist) / dist) * repulsion * 0.05;
            const pushX = dx * force;
            const pushY = dy * force;

            n1.vx -= pushX;
            n1.vy -= pushY;
            n2.vx += pushX;
            n2.vy += pushY;
          }
        }
      }

      // 3. Mouse influence (subtle repulsion)
      const mouseInfluenceRadius = 150;
      for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < mouseInfluenceRadius) {
          const force = ((mouseInfluenceRadius - dist) / mouseInfluenceRadius) * 0.2;
          node.vx += (dx / dist) * force * 0.15;
          node.vy += (dy / dist) * force * 0.15;
        }
      }

      // 4. Update position & boundaries
      const padding = 40;
      const damping = 0.98; // Friction
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        node.vx *= damping;
        node.vy *= damping;

        // Bounce off bounds
        if (node.x < padding) {
          node.x = padding;
          node.vx *= -1;
        } else if (node.x > width - padding) {
          node.x = width - padding;
          node.vx *= -1;
        }

        if (node.y < padding) {
          node.y = padding;
          node.vy *= -1;
        } else if (node.y > height - padding) {
          node.y = height - padding;
          node.vy *= -1;
        }
      }

      // --- Interaction Detection ---
      let currentHoveredNode: PhysicsNode | null = null;
      for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < node.radius + 8) {
          currentHoveredNode = node;
          break; // Prioritize hovering over the first matched node
        }
      }

      if (currentHoveredNode) {
        mouse.hoveredNodeId = currentHoveredNode.id;
        currentHoveredNode.targetGlow = 1;
        canvas.style.cursor = "pointer";
      } else {
        mouse.hoveredNodeId = null;
        canvas.style.cursor = "default";
      }

      // Smooth glow transitions
      for (const node of nodes) {
        if (node.id === mouse.hoveredNodeId) {
          node.targetGlow = 1;
        } else {
          node.targetGlow = 0;
        }
        node.currentGlow += (node.targetGlow - node.currentGlow) * 0.1;
      }

      // --- Drawing Cycle ---
      // 1. Draw Links (Edges)
      ctx.lineWidth = 1;
      for (const link of links) {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);

        if (sourceNode && targetNode) {
          const baseOpacity = Math.min(0.05 + link.strength * 0.08, 0.4);
          const isHighlighted = 
            sourceNode.id === mouse.hoveredNodeId || 
            targetNode.id === mouse.hoveredNodeId;
          
          const opacity = isHighlighted ? baseOpacity * 2.5 : baseOpacity;

          const grad = ctx.createLinearGradient(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
          grad.addColorStop(0, sourceNode.color);
          grad.addColorStop(1, targetNode.color);

          ctx.strokeStyle = grad;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1.0;

      // 2. Draw Nodes (Stars)
      for (const node of nodes) {
        const glowRadius = node.radius + (node.currentGlow * 15);
        
        ctx.save();
        ctx.shadowBlur = 10 + (node.currentGlow * 15);
        ctx.shadowColor = node.color;
        
        const radGrad = ctx.createRadialGradient(
          node.x,
          node.y,
          node.radius * 0.2,
          node.x,
          node.y,
          glowRadius
        );
        
        radGrad.addColorStop(0, "#ffffff");
        radGrad.addColorStop(0.2, node.color);
        radGrad.addColorStop(1, "rgba(9, 9, 11, 0)");

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1 + (node.currentGlow * 0.5);
        ctx.globalAlpha = 0.3 + (node.currentGlow * 0.5);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Update absolute overlay tooltip state
      if (currentHoveredNode) {
        setTooltip({
          x: currentHoveredNode.x,
          y: currentHoveredNode.y - currentHoveredNode.radius - 12,
          name: currentHoveredNode.name,
          weight: currentHoveredNode.weight,
          visible: true,
        });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [loading, error]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    mouseRef.current.hoveredNodeId = null;
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleCanvasClick = () => {
    const hoveredId = mouseRef.current.hoveredNodeId;
    if (hoveredId) {
      const node = nodesRef.current.find((n) => n.id === hoveredId);
      if (node) {
        router.push(`/themes/${node.slug}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950/20 text-zinc-400 gap-3 border border-white/[0.03] rounded-2xl p-8 min-h-[350px]">
        <div className="w-6 h-6 border-2 border-cosmic-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium tracking-widest text-zinc-500 animate-pulse uppercase">
          Mapping Subconscious Coordinates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950/20 text-red-400/80 gap-3 border border-red-500/10 rounded-2xl p-8 min-h-[350px]">
        <svg className="w-8 h-8 text-red-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
          Failed to Connect Coordinates
        </p>
        <p className="text-xxs text-zinc-500 max-w-xs text-center">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black/40 rounded-xl min-h-[350px]">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
        className="block w-full h-full"
      />

      {tooltip.visible && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full bg-zinc-950/90 border border-white/10 rounded-lg py-2 px-3 shadow-xl backdrop-blur-sm transition-all duration-150"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="space-y-0.5 min-w-[120px] text-left">
            <p className="text-xs font-bold text-white tracking-wide">{tooltip.name}</p>
            <p className="text-[10px] text-zinc-400 font-medium">
              Dream Occurrences: <span className="text-cosmic-teal font-semibold">{tooltip.weight}</span>
            </p>
            <div className="w-full border-t border-white/5 my-1" />
            <p className="text-[8px] text-zinc-500 italic">Click to view dynamic constellation</p>
          </div>
        </div>
      )}
    </div>
  );
}
