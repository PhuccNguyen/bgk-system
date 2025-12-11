'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function test() {
      try {
        // Test fetch config
        const configRes = await fetch('/api/test/config');
        const config = await configRes.json();
        
        // Test fetch contestants
        const contestantsRes = await fetch('/api/test/contestants');
        const contestants = await contestantsRes.json();
        
        setData({ config, contestants });
      } catch (error) {
        console.error('Error:', error);
      }
    }
    test();
  }, []);

  if (!data) return <div style={{ padding: '20px' }}>Loading...</div>;

  const onStageSBDs = data.config.ON_STAGE_SBD.split(',').map((s: string) => s.trim()).filter((s: string) => s);
  const onStageContestants = data.contestants.filter((c: any) => onStageSBDs.includes(c.SBD));

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>◆ Test Page - Data Debug</h1>
      
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h2>▣ CONFIG</h2>
        <pre>{JSON.stringify(data.config, null, 2)}</pre>
      </div>

      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h2>👥 ALL CONTESTANTS ({data.contestants.length})</h2>
        <pre>{JSON.stringify(data.contestants, null, 2)}</pre>
      </div>

      <div style={{ background: '#fff3cd', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h2>🎭 ON_STAGE_SBD List</h2>
        <p>Raw: "{data.config.ON_STAGE_SBD}"</p>
        <p>Parsed: [{onStageSBDs.join(', ')}]</p>
        <p>Count: {onStageSBDs.length}</p>
      </div>

      <div style={{ background: '#d4edda', padding: '15px', borderRadius: '8px' }}>
        <h2>✅ ON STAGE CONTESTANTS ({onStageContestants.length})</h2>
        <pre>{JSON.stringify(onStageContestants, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>🎯 Display Mode Logic</h2>
        <p>onStageCount = {onStageContestants.length}</p>
        <p>IS_LOCKED = {data.config.IS_LOCKED ? 'TRUE' : 'FALSE'}</p>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: onStageContestants.length === 0 ? 'red' : 'green' }}>
          Expected Mode: {
            onStageContestants.length === 0 ? 'LOCKED' :
            onStageContestants.length === 1 ? 'SPOTLIGHT' :
            onStageContestants.length === 2 ? 'SPLIT' : 'GRID'
          }
        </p>
      </div>
    </div>
  );
}
