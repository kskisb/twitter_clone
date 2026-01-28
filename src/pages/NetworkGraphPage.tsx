import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { getRelationshipGraph } from '../api/relationships';
import '../styles/NetworkGraph.css';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  group: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: number | Node;
  target: number | Node;
}

const NetworkGraphPage = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndRenderGraph = async () => {
      try {
        setIsLoading(true);
        const data = await getRelationshipGraph();
        renderGraph(data.nodes, data.links);
      } catch (err) {
        console.error('グラフデータの取得に失敗しました:', err);
        setError('ネットワークデータの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndRenderGraph();
  }, []);

  const renderGraph = (nodesData: Node[], linksData: Link[]) => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 既存のSVG要素をクリア
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);

    // ズーム機能の追加
    const g = svg.append('g');
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // 力学シミュレーションの設定
    const simulation = d3.forceSimulation<Node>(nodesData)
      .force('link', d3.forceLink<Node, Link>(linksData)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // リンクの描画
    const link = g.append('g')
      .selectAll('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5);

    // ノードグループの作成
    const node = g.append('g')
      .selectAll('g')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // ノードの円を追加
    node.append('circle')
      .attr('r', 20)
      .attr('fill', '#1da1f2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 20);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        navigate(`/user/${d.id}`);
      });

    // ノードのラベルを追加
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .style('pointer-events', 'none');

    // シミュレーションの更新
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // ドラッグ機能の実装
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  };

  if (isLoading) {
    return (
      <div className="network-graph-page loading">
        <p>ネットワークを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="network-graph-page error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="network-graph-page">
      <div className="network-graph-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1 className="page-title">フォロー関係ネットワーク</h1>
      </div>
      <div className="network-graph-info">
        <p>ノードをクリックするとプロフィールに移動します</p>
        <p>ドラッグでノードを移動、マウスホイールでズームできます</p>
      </div>
      <svg ref={svgRef} className="network-graph-svg"></svg>
    </div>
  );
};

export default NetworkGraphPage;