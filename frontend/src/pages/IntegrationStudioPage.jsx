import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  GitBranch, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Server, 
  Code, 
  ArrowRight, 
  Sparkles,
  Layers,
  FileJson,
  Cpu,
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const IntegrationStudioPage = ({ onNavigateToApplications }) => {
  const { addToast } = useNotification();

  // Ingestion Form State (System A format)
  const [formData, setFormData] = useState({
    applicationId: `MH-MSINS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    beneficiaryId: `MH-CIT-${Math.floor(10000000 + Math.random() * 90000000)}`,
    fname: 'Vaibhav',
    lname: 'Kulkarni',
    dob: '1998-06-15',
    schemeCode: 'MSINS-STARTUP-2026'
  });

  // Pipeline Execution State
  const [executionState, setExecutionState] = useState({
    status: 'idle', // 'idle', 'running', 'completed', 'error'
    currentStep: 0, // 1: Ingestion, 2: Canonical, 3: Downstream B/C, 4: Aggregation, 5: Persisted
    executionTimeMs: 0,
    correlationId: null,
    canonicalPayload: null,
    systemBResponse: null,
    systemCResponse: null,
    finalResult: null
  });

  const [activeInspectorTab, setActiveInspectorTab] = useState('canonical'); // 'canonical', 'systemB', 'systemC', 'final'

  // Preset Scenarios
  const loadScenario = (type) => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const randomCit = Math.floor(10000000 + Math.random() * 90000000);

    if (type === 'eligible') {
      setFormData({
        applicationId: `MH-MSINS-2026-${randomId}`,
        beneficiaryId: `MH-CIT-${randomCit}`,
        fname: 'Neha',
        lname: 'Bhosale',
        dob: '1997-03-22',
        schemeCode: 'MSINS-STARTUP-2026'
      });
      addToast('Loaded: Eligible Innovation Applicant Scenario', 'info');
    } else if (type === 'age_mismatch') {
      setFormData({
        applicationId: `MH-SKILL-2026-${randomId}`,
        beneficiaryId: `MH-CIT-${randomCit}`,
        fname: 'Rohan',
        lname: 'Joshi',
        dob: '2015-08-10', // Underage
        schemeCode: 'PMKVY-MAHA-SKILL'
      });
      addToast('Loaded: Underage Beneficiary Scenario (System B will flag)', 'warning');
    } else if (type === 'subsidy_conflict') {
      setFormData({
        applicationId: `MH-CMEGP-2026-${randomId}`,
        beneficiaryId: `MH-CIT-${randomCit}`,
        fname: 'Ineligible_Beneficiary',
        lname: 'Fail',
        dob: '1988-12-05',
        schemeCode: 'CMEGP-EMPLOY-01'
      });
      addToast('Loaded: Concurrent Subsidy Conflict Scenario (System C will flag)', 'warning');
    }
  };

  const runPipeline = async () => {
    if (!formData.applicationId || !formData.beneficiaryId || !formData.fname || !formData.lname || !formData.dob) {
      addToast('Please fill all mandatory fields.', 'warning');
      return;
    }

    const startTime = performance.now();
    const traceId = `eks-${Date.now().toString(16)}-${Math.random().toString(16).substring(2, 6)}`;

    // Step 1: Ingestion
    setExecutionState({
      status: 'running',
      currentStep: 1,
      executionTimeMs: 0,
      correlationId: traceId,
      canonicalPayload: null,
      systemBResponse: null,
      systemCResponse: null,
      finalResult: null
    });

    await new Promise(r => setTimeout(r, 450));

    // Step 2: Canonical Normalization
    const canonical = {
      applicationId: formData.applicationId,
      citizenId: formData.beneficiaryId,
      applicantName: `${formData.fname} ${formData.lname}`,
      dateOfBirth: formData.dob,
      schemeCode: formData.schemeCode
    };

    setExecutionState(prev => ({
      ...prev,
      currentStep: 2,
      canonicalPayload: canonical
    }));

    await new Promise(r => setTimeout(r, 600));

    // Step 3: Parallel Downstream Systems (System B REST & System C XML)
    setExecutionState(prev => ({ ...prev, currentStep: 3 }));

    try {
      const response = await api.integration.processApplication(formData);
      await new Promise(r => setTimeout(r, 650));

      // Step 4: Rule Aggregation
      setExecutionState(prev => ({ ...prev, currentStep: 4 }));
      await new Promise(r => setTimeout(r, 400));

      // Step 5: Master Persisted in MongoDB
      const endTime = performance.now();
      setExecutionState(prev => ({
        ...prev,
        status: 'completed',
        currentStep: 5,
        executionTimeMs: Math.round(endTime - startTime),
        finalResult: response,
        systemBResponse: response.systems?.find(s => s.system.includes('SYSTEM-B')) || { system: 'SYSTEM-B (REST)', eligible: true, status: 'ELIGIBLE' },
        systemCResponse: response.systems?.find(s => s.system.includes('SYSTEM-C')) || { system: 'SYSTEM-C (XML)', eligible: response.eligible, status: response.eligible ? 'ELIGIBLE' : 'INELIGIBLE' }
      }));

      addToast(`Pipeline execution completed in ${Math.round(endTime - startTime)}ms!`, response.eligible ? 'success' : 'warning');
    } catch (err) {
      setExecutionState(prev => ({
        ...prev,
        status: 'error',
        executionTimeMs: Math.round(performance.now() - startTime)
      }));
      addToast(err.message || 'Pipeline processing failed', 'error');
    }
  };

  const resetPipeline = () => {
    setExecutionState({
      status: 'idle',
      currentStep: 0,
      executionTimeMs: 0,
      correlationId: null,
      canonicalPayload: null,
      systemBResponse: null,
      systemCResponse: null,
      finalResult: null
    });
  };

  return (
    <div className="page-body">
      {/* Studio Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>EkSutra Studio: Live Workflow Orchestration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Test end-to-end System A Ingestion, Canonical Mapping, Parallel REST/XML Connectors, and Rule Aggregation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={resetPipeline}>
            <RotateCcw size={14} />
            <span>Reset Studio</span>
          </button>
          <button 
            className="btn btn-emerald btn-sm"
            onClick={runPipeline}
            disabled={executionState.status === 'running'}
          >
            <Play size={14} />
            <span>{executionState.status === 'running' ? 'Executing Pipeline...' : 'Execute Live Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px', background: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Quick Test Scenarios:</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm btn-outline" onClick={() => loadScenario('eligible')}>
              1. Eligible (All Systems Pass)
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => loadScenario('age_mismatch')}>
              2. Age Discrepancy (System B REST)
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => loadScenario('subsidy_conflict')}>
              3. Conflict Breach (System C XML)
            </button>
          </div>
        </div>
      </div>

      {/* Live Animated Pipeline Visualizer Canvas */}
      <div className="pipeline-container">
        <div className="pipeline-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GitBranch size={20} color="var(--primary-500)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Real-Time Orchestration Graph</h3>
          </div>

          {executionState.correlationId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Trace ID:</span>
              <span className="badge badge-scheme">{executionState.correlationId}</span>
              {executionState.executionTimeMs > 0 && (
                <span className="badge badge-verified">{executionState.executionTimeMs} ms</span>
              )}
            </div>
          )}
        </div>

        {/* Pipeline Nodes */}
        <div className="pipeline-canvas">
          {/* Node 1: Ingestion */}
          <div className={`pipeline-node ${executionState.currentStep >= 1 ? (executionState.currentStep === 1 ? 'status-active' : 'status-success') : 'status-idle'}`}>
            <div className="node-icon-circle" style={{ '--node-bg': 'var(--primary-50)', '--node-color': 'var(--primary-600)' }}>
              <Send size={20} />
            </div>
            <div className="node-title">System A</div>
            <div className="node-subtext">Intake Portal</div>
            <span className={`node-status-badge ${executionState.currentStep >= 1 ? 'badge-verified' : 'badge-on_hold'}`}>
              {executionState.currentStep >= 1 ? 'Ingested' : 'Waiting'}
            </span>
          </div>

          <div className={`pipeline-connector ${executionState.currentStep >= 1 ? 'active' : ''}`}></div>

          {/* Node 2: Canonical Normalizer */}
          <div className={`pipeline-node ${executionState.currentStep >= 2 ? (executionState.currentStep === 2 ? 'status-active' : 'status-success') : 'status-idle'}`}>
            <div className="node-icon-circle" style={{ '--node-bg': 'var(--cyan-light)', '--node-color': 'var(--cyan-600)' }}>
              <Layers size={20} />
            </div>
            <div className="node-title">Canonical Bridge</div>
            <div className="node-subtext">Data Normalizer</div>
            <span className={`node-status-badge ${executionState.currentStep >= 2 ? 'badge-verified' : 'badge-on_hold'}`}>
              {executionState.currentStep >= 2 ? 'Transformed' : 'Queued'}
            </span>
          </div>

          <div className={`pipeline-connector ${executionState.currentStep >= 2 ? 'active' : ''}`}></div>

          {/* Node 3: Parallel Downstream Systems */}
          <div className="parallel-branch-container">
            {/* System B */}
            <div className={`pipeline-node ${executionState.currentStep >= 3 ? (executionState.currentStep === 3 ? 'status-active' : (executionState.systemBResponse?.eligible ? 'status-success' : 'status-error')) : 'status-idle'}`} style={{ width: 180 }}>
              <div className="node-icon-circle" style={{ '--node-bg': 'var(--emerald-light)', '--node-color': 'var(--emerald-600)' }}>
                <Server size={18} />
              </div>
              <div className="node-title">System B (REST)</div>
              <div className="node-subtext">Maha-Citizen Registry</div>
              <span className={`node-status-badge ${executionState.currentStep >= 3 ? (executionState.systemBResponse?.eligible ? 'badge-verified' : 'badge-rejected') : 'badge-on_hold'}`}>
                {executionState.currentStep >= 3 ? (executionState.systemBResponse?.eligible ? '200 OK Match' : 'Rule Flagged') : 'Pending'}
              </span>
            </div>

            {/* System C */}
            <div className={`pipeline-node ${executionState.currentStep >= 3 ? (executionState.currentStep === 3 ? 'status-active' : (executionState.systemCResponse?.eligible ? 'status-success' : 'status-error')) : 'status-idle'}`} style={{ width: 180 }}>
              <div className="node-icon-circle" style={{ '--node-bg': 'var(--amber-light)', '--node-color': 'var(--amber-600)' }}>
                <FileJson size={18} />
              </div>
              <div className="node-title">System C (XML)</div>
              <div className="node-subtext">Legacy MSInS Store</div>
              <span className={`node-status-badge ${executionState.currentStep >= 3 ? (executionState.systemCResponse?.eligible ? 'badge-verified' : 'badge-rejected') : 'badge-on_hold'}`}>
                {executionState.currentStep >= 3 ? (executionState.systemCResponse?.eligible ? 'XML Valid' : 'Discrepancy') : 'Pending'}
              </span>
            </div>
          </div>

          <div className={`pipeline-connector ${executionState.currentStep >= 4 ? 'active' : ''}`}></div>

          {/* Node 4: Rule Aggregation */}
          <div className={`pipeline-node ${executionState.currentStep >= 4 ? (executionState.currentStep === 4 ? 'status-active' : 'status-success') : 'status-idle'}`}>
            <div className="node-icon-circle" style={{ '--node-bg': 'var(--primary-50)', '--node-color': 'var(--primary-600)' }}>
              <Cpu size={20} />
            </div>
            <div className="node-title">Decision Engine</div>
            <div className="node-subtext">Multi-Rule Aggregator</div>
            <span className={`node-status-badge ${executionState.currentStep >= 4 ? 'badge-verified' : 'badge-on_hold'}`}>
              {executionState.currentStep >= 4 ? 'Evaluated' : 'Waiting'}
            </span>
          </div>

          <div className={`pipeline-connector ${executionState.currentStep >= 5 ? 'active' : ''}`}></div>

          {/* Node 5: Master Persistence */}
          <div className={`pipeline-node ${executionState.currentStep >= 5 ? 'status-success' : 'status-idle'}`}>
            <div className="node-icon-circle" style={{ '--node-bg': 'var(--emerald-light)', '--node-color': 'var(--emerald-600)' }}>
              <Database size={20} />
            </div>
            <div className="node-title">MongoDB Master</div>
            <div className="node-subtext">Audit & Lifecycle</div>
            <span className={`node-status-badge ${executionState.currentStep >= 5 ? 'badge-verified' : 'badge-on_hold'}`}>
              {executionState.currentStep >= 5 ? 'Persisted' : 'Queued'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Ingestion Form + Live Payload Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 20 }}>
        {/* Left: Ingestion Input Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">System A Application Ingestion</div>
              <div className="card-subtitle">Simulate incoming payload from external department</div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); runPipeline(); }}>
            <div className="form-group">
              <label className="form-label">Application ID</label>
              <input
                type="text"
                className="form-input"
                value={formData.applicationId}
                onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Beneficiary ID (Aadhaar/Citizen)</label>
              <input
                type="text"
                className="form-input"
                value={formData.beneficiaryId}
                onChange={(e) => setFormData({ ...formData, beneficiaryId: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fname}
                  onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.lname}
                  onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maharashtra Scheme Code</label>
              <select
                className="form-select"
                value={formData.schemeCode}
                onChange={(e) => setFormData({ ...formData, schemeCode: e.target.value })}
              >
                <option value="MSINS-STARTUP-2026">MSINS-STARTUP-2026 (Startup Seed Grant)</option>
                <option value="PMKVY-MAHA-SKILL">PMKVY-MAHA-SKILL (Kaushalya Vikas)</option>
                <option value="CMEGP-EMPLOY-01">CMEGP-EMPLOY-01 (CM Employment Scheme)</option>
                <option value="MAHA-FARM-SOLAR">MAHA-FARM-SOLAR (Solar Agriculture Pump)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 8 }}
              disabled={executionState.status === 'running'}
            >
              <Play size={16} />
              <span>{executionState.status === 'running' ? 'Processing...' : 'Run Pipeline Check'}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Payload Inspector */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Live Payload & Transformation Inspector</div>
              <div className="card-subtitle">Real-time schema mapping and connector responses</div>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`btn btn-sm ${activeInspectorTab === 'canonical' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveInspectorTab('canonical')}
              >
                Canonical (JSON)
              </button>
              <button
                className={`btn btn-sm ${activeInspectorTab === 'systemB' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveInspectorTab('systemB')}
              >
                System B (REST)
              </button>
              <button
                className={`btn btn-sm ${activeInspectorTab === 'systemC' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveInspectorTab('systemC')}
              >
                System C (XML)
              </button>
              <button
                className={`btn btn-sm ${activeInspectorTab === 'final' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveInspectorTab('final')}
              >
                Result Schema
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {activeInspectorTab === 'canonical' && (
              <div className="code-viewer-panel">
                <div className="code-viewer-header">
                  <span>Normalized Canonical Application</span>
                  <span>EkSutra CDM v3.1</span>
                </div>
                <div className="code-viewer-content">
                  {JSON.stringify(executionState.canonicalPayload || {
                    applicationId: formData.applicationId,
                    citizenId: formData.beneficiaryId,
                    applicantName: `${formData.fname} ${formData.lname}`,
                    dateOfBirth: formData.dob,
                    schemeCode: formData.schemeCode,
                    message: "Execute the pipeline to see real-time normalized output"
                  }, null, 2)}
                </div>
              </div>
            )}

            {activeInspectorTab === 'systemB' && (
              <div className="code-viewer-panel">
                <div className="code-viewer-header">
                  <span>System B REST Request / Response</span>
                  <span>HTTP 200 OK</span>
                </div>
                <div className="code-viewer-content">
                  {JSON.stringify({
                    endpoint: "http://localhost:8082/api/v1/eligibility/check",
                    method: "POST",
                    headers: {
                      "X-Correlation-ID": executionState.correlationId || "eks-sample-id"
                    },
                    response: executionState.systemBResponse || {
                      eligible: true,
                      status: "ELIGIBLE - Demographics and age criteria matched"
                    }
                  }, null, 2)}
                </div>
              </div>
            )}

            {activeInspectorTab === 'systemC' && (
              <div className="code-viewer-panel">
                <div className="code-viewer-header">
                  <span>System C Legacy XML Schema</span>
                  <span>XML Payload</span>
                </div>
                <div className="code-viewer-content">
                  {`<?xml version="1.0" encoding="UTF-8"?>
<EligibilityCheckRequest>
  <CitizenId>${formData.beneficiaryId}</CitizenId>
  <Scheme>${formData.schemeCode}</Scheme>
  <CorrelationId>${executionState.correlationId || "eks-trace-sample"}</CorrelationId>
  <StatusResponse>
    <Status>${executionState.systemCResponse?.status || "PENDING_CHECK"}</Status>
    <Eligible>${executionState.systemCResponse ? executionState.systemCResponse.eligible : true}</Eligible>
  </StatusResponse>
</EligibilityCheckRequest>`}
                </div>
              </div>
            )}

            {activeInspectorTab === 'final' && (
              <div className="code-viewer-panel">
                <div className="code-viewer-header">
                  <span>IntegrationSystemResponse</span>
                  <span>Persisted Record</span>
                </div>
                <div className="code-viewer-content">
                  {JSON.stringify(executionState.finalResult || {
                    status: "Run pipeline to generate complete output",
                    ready: true
                  }, null, 2)}
                </div>
              </div>
            )}
          </div>

          {executionState.status === 'completed' && (
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', padding: 12, borderRadius: 8 }}>
              <span style={{ fontSize: '0.84rem' }}>
                Application saved to registry with status <strong>{executionState.finalResult?.eligible ? 'ELIGIBILITY_VERIFIED' : 'ON_HOLD'}</strong>.
              </span>
              <button 
                className="btn btn-outline btn-sm"
                onClick={onNavigateToApplications}
              >
                View in Registry &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
