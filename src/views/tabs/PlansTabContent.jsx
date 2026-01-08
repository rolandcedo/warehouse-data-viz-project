import React, { useState } from 'react';
import {
  Users, MapPin, Clock, Package, Truck, AlertTriangle, ArrowRight,
  ChevronRight, ChevronLeft, Zap, CheckCircle, Info, AlertOctagon,
  Lightbulb, MoreVertical, Eye, RefreshCw, Settings, Trash2, Activity,
  Minus, Plus, X, TrendingUp, Search, Filter, ArrowUpRight, ArrowDownRight,
  RotateCcw, Wrench, ChevronDown, ClipboardList, Calendar, Play, Circle
} from 'lucide-react';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import shared data
import { ALERTS_DATA } from '../../data/alertsData';

// Import UI components
import { Card, Badge, Alert, Header } from '../../components/UI';

const PlansTabContent = ({ onViewInsights, onNavigateToAlert, allPlans, setAllPlans }) => {
  // Get scenario mode functions from context
  const { activateDraftPlanScenario, scenarioMode, scenarioSource, draftPlanScenario, exitDraftPlanScenario } = useTimeContext();
  
  // View state: 'list' or 'detail'
  const [viewMode, setViewMode] = React.useState('list');
  const [selectedPlanId, setSelectedPlanId] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  
  // Completion feedback banner
  const [completionBanner, setCompletionBanner] = React.useState({ show: false, planName: '', action: '', followOnPlanId: null });
  
  // Activity Feed for selected plan
  const [activities, setActivities] = React.useState([
    { id: 'a1', type: 'status', user: 'Mike Chen', action: 'marked task as complete', target: 'Add 4 FTE pickers', time: '10:52 AM' },
    { id: 'a2', type: 'comment', user: 'Sarah Kim', content: 'Receiving will be short for ~30 min, heads up to dock team', time: '11:05 AM' },
    { id: 'a3', type: 'status', user: 'Sarah Kim', action: 'marked task as complete', target: 'Reassign 2 FTEs', time: '11:08 AM' },
    { id: 'a4', type: 'status', user: 'James Liu', action: 'started task', target: 'Activate overflow Zone Z07', time: '11:12 AM' },
    { id: 'a5', type: 'metric', content: 'Staff score improved: 76 → 82', time: '11:15 AM' },
    { id: 'a6', type: 'comment', user: 'James Liu', content: 'Z07 equipment staging 50% complete, on track', time: '11:22 AM' }
  ]);
  
  const [newComment, setNewComment] = React.useState('');
  const [showHandoff, setShowHandoff] = React.useState(false);
  const [handoffAccepted, setHandoffAccepted] = React.useState(false);
  
  // Stop Plan modal state
  const [stopPlanModal, setStopPlanModal] = React.useState({ isOpen: false, planId: null });
  const [taskModal, setTaskModal] = React.useState({ isOpen: false, task: null, planId: null });
  const [stopReason, setStopReason] = React.useState('');
  const [stopNotes, setStopNotes] = React.useState('');
  
  // Complete Plan modal state
  const [completePlanModal, setCompletePlanModal] = React.useState({ isOpen: false, planId: null });
  const [completionNotes, setCompletionNotes] = React.useState('');
  const [showExploratoryPreview, setShowExploratoryPreview] = React.useState(false);
  
  // Get all active plans for conflict detection
  const activePlans = allPlans.filter(p => p.status === 'active');
  const hasMultipleActivePlans = activePlans.length > 1;
  
  // Stats calculation
  const stats = React.useMemo(() => {
    const completed = allPlans.filter(p => p.status === 'completed');
    const successful = completed.filter(p => p.outcome === 'success');
    const thisWeek = allPlans.filter(p => ['Dec 16', 'Dec 17', 'Dec 18', 'Dec 19'].includes(p.date));
    const avgDuration = completed.filter(p => p.duration).map(p => {
      const match = p.duration.match(/(\d+)h\s*(\d+)?m?/);
      if (match) return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
      return 0;
    });
    const avgMins = avgDuration.length ? Math.round(avgDuration.reduce((a, b) => a + b, 0) / avgDuration.length) : 0;
    
    return {
      totalThisWeek: thisWeek.length,
      successRate: completed.length ? Math.round((successful.length / completed.length) * 100) : 0,
      avgDuration: avgMins ? `${Math.floor(avgMins / 60)}h ${avgMins % 60}m` : '—',
      active: allPlans.filter(p => p.status === 'active').length,
      drafts: allPlans.filter(p => p.status === 'draft').length,
      pending: allPlans.filter(p => p.status === 'pending-approval').length
    };
  }, [allPlans]);
  
  // Filtered plans
  const filteredPlans = React.useMemo(() => {
    let result = allPlans;
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.createdBy.name.toLowerCase().includes(query) ||
        p.shiftContext.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [allPlans, statusFilter, searchQuery]);
  
  // Get selected plan
  const selectedPlan = selectedPlanId ? allPlans.find(p => p.id === selectedPlanId) : null;
  const activePlan = allPlans.find(p => p.status === 'active');
  
  // Navigate to plan detail
  const viewPlan = (planId) => {
    setSelectedPlanId(planId);
    setViewMode('detail');
  };
  
  // Task status helpers
  const getTasksByStatus = (tasks, status) => tasks?.filter(t => t.status === status) || [];
  
  // Update task status
  const updateTaskStatus = (planId, taskId, newStatus) => {
    setAllPlans(allPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tasks: plan.tasks.map(task => {
            if (task.id === taskId) {
              const updates = { status: newStatus };
              if (newStatus === 'in-progress') updates.startedAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              if (newStatus === 'done') updates.completedAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return { ...task, ...updates };
            }
            return task;
          }),
          progress: Math.round(
            (plan.tasks.filter(t => t.id === taskId ? newStatus === 'done' : t.status === 'done').length / plan.tasks.length) * 100
          )
        };
      }
      return plan;
    }));
    
    const task = selectedPlan?.tasks.find(t => t.id === taskId);
    const action = newStatus === 'in-progress' ? 'started task' : newStatus === 'done' ? 'marked task as complete' : 'moved task to todo';
    setActivities([
      { id: `a${Date.now()}`, type: 'status', user: 'You', action, target: task?.title, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
      ...activities
    ]);
  };
  
  // Add comment
  const addComment = () => {
    if (newComment.trim()) {
      setActivities([
        { id: `a${Date.now()}`, type: 'comment', user: 'You', content: newComment, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
        ...activities
      ]);
      setNewComment('');
    }
  };
  
  // Status config
  const statusConfig = {
    'active': { label: 'Active', color: C.success, bg: C.success[100], text: C.success[700] },
    'draft': { label: 'Draft', color: C.neutral, bg: C.neutral[100], text: C.neutral[600] },
    'pending-approval': { label: 'Pending', color: C.warning, bg: C.warning[100], text: C.warning[700] },
    'completed': { label: 'Completed', color: C.brand, bg: C.brand[100], text: C.brand[700] },
    'partial': { label: 'Partial', color: C.warning, bg: C.warning[100], text: C.warning[700] },
    'abandoned': { label: 'Abandoned', color: C.error, bg: C.error[100], text: C.error[700] }
  };
  
  const outcomeConfig = {
    'success': { icon: CheckCircle, label: 'Success', color: C.success[600] },
    'partial': { icon: AlertTriangle, label: 'Partial', color: C.warning[600] },
    'abandoned': { icon: X, label: 'Abandoned', color: C.error[600] },
    'superseded': { icon: Minus, label: 'Superseded', color: C.neutral[500] }
  };
  
  // Task Card Component (click to open detail modal)
  const TaskCard = ({ task, planId, showActions = true }) => {
    const statusColors = {
      todo: C.neutral,
      'in-progress': C.brand,
      done: C.success,
      incomplete: C.warning
    };
    const colors = statusColors[task.status] || C.neutral;
    const hasActions = task.actions && task.actions.length > 0;
    const appliedCount = hasActions ? task.actions.filter(a => a.status === 'applied').length : 0;
    const totalCount = hasActions ? task.actions.length : 0;
    
    return (
      <div 
        onClick={() => setTaskModal({ isOpen: true, task, planId })}
        style={{
          background: 'white',
          border: `1px solid ${C.neutral[200]}`,
          borderRadius: 8,
          marginBottom: sp.sm,
          borderLeft: `3px solid ${colors[500]}`,
          padding: sp.sm,
          cursor: 'pointer',
          transition: 'box-shadow 0.15s, border-color 0.15s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = colors[300]; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.neutral[200]; }}
      >
        {/* Title Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: C.neutral[800], flex: 1, lineHeight: 1.3 }}>{task.title}</span>
          {hasActions && (
            <span style={{ 
              padding: '2px 6px', 
              fontSize: '10px', 
              fontWeight: 600,
              background: appliedCount === totalCount ? C.success[100] : appliedCount > 0 ? C.warning[100] : C.neutral[100],
              color: appliedCount === totalCount ? C.success[700] : appliedCount > 0 ? C.warning[700] : C.neutral[600],
              borderRadius: 10,
              marginLeft: sp.xs,
              whiteSpace: 'nowrap'
            }}>
              {appliedCount}/{totalCount}
            </span>
          )}
        </div>
        
        {/* Tradeoff Warning */}
        {task.tradeoff && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: C.warning[600], marginBottom: sp.xs }}>
            <AlertTriangle style={{ width: 12, height: 12 }} />
            {task.tradeoff}
          </div>
        )}
        
        {/* Meta Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, fontSize: '11px', color: C.neutral[500], flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users style={{ width: 11, height: 11 }} />
            {task.assignee?.name || 'Unassigned'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock style={{ width: 11, height: 11 }} />
            {task.status === 'done' ? `Done ${task.completedAt}` : task.status === 'in-progress' ? `Started ${task.startedAt}` : `Due ${task.dueTime}`}
          </div>
        </div>
      </div>
    );
  };
  
  // Task Detail Modal with Actions
  const TaskDetailModal = () => {
    if (!taskModal.isOpen || !taskModal.task) return null;
    
    const task = taskModal.task;
    const planId = taskModal.planId;
    const statusColors = { todo: C.neutral, 'in-progress': C.brand, done: C.success, incomplete: C.warning };
    const colors = statusColors[task.status] || C.neutral;
    const canEdit = task.status === 'in-progress' || task.status === 'todo';
    
    const getActionIcon = (type) => {
      if (type.includes('staff')) return Users;
      if (type.includes('equipment')) return Wrench;
      if (type.includes('zone')) return MapPin;
      if (type.includes('metric')) return TrendingUp;
      return Settings;
    };
    
    const getActionDescription = (action) => {
      switch (action.type) {
        case 'staff-assign':
          return `Assign to ${action.target.function} in ${action.target.zone}`;
        case 'staff-move':
          return `Move from ${action.target.fromFunction} → ${action.target.toFunction}`;
        case 'equipment-stage':
          return `Stage in ${action.target.zone}`;
        case 'zone-status':
          return `Set status to ${action.target.status}`;
        case 'metric-watch':
          return `Monitor ≥ ${action.target.value} ${action.target.unit}`;
        default:
          return JSON.stringify(action.target);
      }
    };
    
    const toggleActionStatus = (actionId) => {
      if (!canEdit) return;
      setAllPlans(allPlans.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id !== task.id) return t;
            return {
              ...t,
              actions: t.actions.map(a => {
                if (a.id !== actionId) return a;
                const newStatus = a.status === 'applied' ? 'pending' : 'applied';
                return {
                  ...a,
                  status: newStatus,
                  actual: newStatus === 'applied' ? a.target : null,
                  appliedAt: newStatus === 'applied' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null
                };
              })
            };
          })
        };
      }));
      // Update the task in the modal
      setTaskModal(prev => ({
        ...prev,
        task: {
          ...prev.task,
          actions: prev.task.actions.map(a => {
            if (a.id !== actionId) return a;
            const newStatus = a.status === 'applied' ? 'pending' : 'applied';
            return { ...a, status: newStatus, actual: newStatus === 'applied' ? a.target : null, appliedAt: newStatus === 'applied' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null };
          })
        }
      }));
    };
    
    // Group actions by entity type
    const actionsByType = (task.actions || []).reduce((acc, action) => {
      const type = action.entity?.type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(action);
      return acc;
    }, {});
    
    const entityTypeLabels = { staff: 'Staff', equipment: 'Equipment', zone: 'Zones', metric: 'Metrics' };
    const entityTypeIcons = { staff: Users, equipment: Wrench, zone: MapPin, metric: TrendingUp };
    
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setTaskModal({ isOpen: false, task: null, planId: null })}>
        <div style={{ width: 600, maxHeight: '90vh', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding: sp.md, borderBottom: `1px solid ${C.neutral[200]}`, background: colors[50] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    background: colors[100], 
                    color: colors[700], 
                    borderRadius: 4, 
                    textTransform: 'uppercase' 
                  }}>
                    {task.status.replace('-', ' ')}
                  </span>
                  {task.type && (
                    <span style={{ fontSize: '11px', color: C.neutral[500] }}>
                      {task.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 500, color: C.neutral[800], margin: 0 }}>{task.title}</h2>
              </div>
              <button onClick={() => setTaskModal({ isOpen: false, task: null, planId: null })} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18, color: C.neutral[600] }} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginTop: sp.sm, fontSize: '13px', color: C.neutral[600] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users style={{ width: 14, height: 14 }} />
                {task.assignee?.name} {task.assignee?.role && <span style={{ color: C.neutral[400] }}>({task.assignee.role})</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock style={{ width: 14, height: 14 }} />
                {task.status === 'done' ? `Completed ${task.completedAt}` : task.status === 'in-progress' ? `Started ${task.startedAt}` : `Due ${task.dueTime}`}
              </div>
              {task.duration && <span>{task.duration} min</span>}
            </div>
            
            {task.tradeoff && (
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginTop: sp.sm, padding: sp.xs, background: C.warning[100], borderRadius: 4 }}>
                <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />
                <span style={{ fontSize: '12px', color: C.warning[700] }}>{task.tradeoff}</span>
              </div>
            )}
            
            {task.notes && (
              <div style={{ marginTop: sp.sm, padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.neutral[200]}` }}>
                <span style={{ fontSize: '12px', color: C.neutral[600] }}>{task.notes}</span>
              </div>
            )}
          </div>
          
          {/* Content - Actions */}
          <div style={{ flex: 1, overflowY: 'auto', padding: sp.md }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp.md }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800], margin: 0 }}>
                Actions ({task.actions?.filter(a => a.status === 'applied').length || 0}/{task.actions?.length || 0} applied)
              </h3>
              {canEdit && (
                <span style={{ fontSize: '11px', color: C.neutral[500] }}>Click to toggle status</span>
              )}
            </div>
            
            {Object.entries(actionsByType).map(([type, actions]) => {
              const TypeIcon = entityTypeIcons[type] || Settings;
              return (
                <div key={type} style={{ marginBottom: sp.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.sm }}>
                    <TypeIcon style={{ width: 14, height: 14, color: C.neutral[500] }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[600], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {entityTypeLabels[type] || type} ({actions.filter(a => a.status === 'applied').length}/{actions.length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                    {actions.map(action => {
                      const isApplied = action.status === 'applied';
                      return (
                        <div 
                          key={action.id}
                          onClick={() => toggleActionStatus(action.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: sp.sm,
                            padding: sp.sm,
                            background: isApplied ? C.success[50] : 'white',
                            border: `1px solid ${isApplied ? C.success[300] : C.neutral[200]}`,
                            borderRadius: 8,
                            cursor: canEdit ? 'pointer' : 'default',
                            transition: 'all 0.15s'
                          }}
                        >
                          {/* Checkbox */}
                          <div style={{
                            width: 20, height: 20,
                            borderRadius: 4,
                            border: `2px solid ${isApplied ? C.success[500] : C.neutral[300]}`,
                            background: isApplied ? C.success[500] : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isApplied && <CheckCircle style={{ width: 12, height: 12, color: 'white' }} />}
                          </div>
                          
                          {/* Entity Info */}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: isApplied ? C.success[800] : C.neutral[800] }}>
                              {action.entity.name}
                            </div>
                            <div style={{ fontSize: '11px', color: isApplied ? C.success[600] : C.neutral[500] }}>
                              {getActionDescription(action)}
                            </div>
                          </div>
                          
                          {/* Timestamp */}
                          {action.appliedAt && (
                            <span style={{ fontSize: '11px', color: C.success[600], whiteSpace: 'nowrap' }}>
                              {action.appliedAt}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {(!task.actions || task.actions.length === 0) && (
              <div style={{ padding: sp.lg, textAlign: 'center', color: C.neutral[400], background: C.neutral[50], borderRadius: 8 }}>
                No actions defined for this task
              </div>
            )}
            
            {/* System Impact */}
            {task.systemImpact && (
              <div style={{ marginTop: sp.md, padding: sp.sm, background: C.brand[50], borderRadius: 8, border: `1px solid ${C.brand[200]}` }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: C.brand[700], margin: 0, marginBottom: sp.sm, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp style={{ width: 14, height: 14 }} />
                  System Impact
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp.sm }}>
                  {Object.entries(task.systemImpact.after || {}).map(([key, afterValue]) => {
                    const beforeValue = task.systemImpact.before?.[key];
                    const delta = typeof afterValue === 'number' && typeof beforeValue === 'number' ? afterValue - beforeValue : null;
                    return (
                      <div key={key} style={{ padding: sp.xs, background: 'white', borderRadius: 4, border: `1px solid ${C.brand[200]}` }}>
                        <div style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px' }}>
                          <span style={{ color: C.neutral[400] }}>{beforeValue}</span>
                          <ArrowRight style={{ width: 10, height: 10, color: C.neutral[300] }} />
                          <span style={{ fontWeight: 600, color: delta > 0 ? C.success[600] : delta < 0 ? C.warning[600] : C.neutral[700] }}>{afterValue}</span>
                          {delta !== null && <span style={{ fontSize: '10px', color: delta > 0 ? C.success[600] : delta < 0 ? C.warning[600] : C.neutral[500] }}>({delta > 0 ? '+' : ''}{delta})</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div style={{ padding: sp.md, borderTop: `1px solid ${C.neutral[200]}`, background: C.neutral[50], display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setTaskModal({ isOpen: false, task: null, planId: null })} style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.neutral[700], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}>
              Close
            </button>
            {canEdit && (
              <div style={{ display: 'flex', gap: sp.sm }}>
                {task.status === 'todo' && (
                  <button onClick={() => { updateTaskStatus(planId, task.id, 'in-progress'); setTaskModal(prev => ({ ...prev, task: { ...prev.task, status: 'in-progress', startedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } })); }} style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: C.brand[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                    Start Task
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <button onClick={() => { updateTaskStatus(planId, task.id, 'done'); setTaskModal({ isOpen: false, task: null, planId: null }); }} style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: C.success[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                    Mark Complete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ===== LIST VIEW =====
  if (viewMode === 'list') {
    return (
      <>
        <Header icon={ClipboardList} title="Plan Execution" sub="Track active plans, review history, and manage operational interventions" color={C.success[600]} />
        
        {/* Completion Banner */}
        {completionBanner.show && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: sp.md, 
            padding: sp.md, 
            marginBottom: sp.md,
            background: completionBanner.action === 'completed' || completionBanner.action === 'executed' ? C.success[50] : completionBanner.action === 'handoff' ? C.purple[50] : C.brand[50], 
            borderRadius: 8, 
            border: `1px solid ${completionBanner.action === 'completed' || completionBanner.action === 'executed' ? C.success[200] : completionBanner.action === 'handoff' ? C.purple[200] : C.brand[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              {completionBanner.action === 'completed' || completionBanner.action === 'executed' ? (
                <CheckCircle style={{ width: 20, height: 20, color: C.success[600] }} />
              ) : completionBanner.action === 'handoff' ? (
                <RefreshCw style={{ width: 20, height: 20, color: C.purple[600] }} />
              ) : completionBanner.action === 'follow-on' ? (
                <ClipboardList style={{ width: 20, height: 20, color: C.brand[600] }} />
              ) : (
                <CheckCircle style={{ width: 20, height: 20, color: C.neutral[500] }} />
              )}
              <div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800] }}>
                  {completionBanner.action === 'completed' && `"${completionBanner.planName}" completed successfully`}
                  {completionBanner.action === 'executed' && `"${completionBanner.planName}" is now live`}
                  {completionBanner.action === 'handoff' && `"${completionBanner.planName}" handed off to next shift`}
                  {completionBanner.action === 'follow-on' && `"${completionBanner.planName}" completed — follow-on plan created`}
                  {completionBanner.action === 'closed' && `"${completionBanner.planName}" closed and archived`}
                </span>
                {completionBanner.followOnPlanName && (
                  <span style={{ fontSize: '13px', color: C.neutral[600], display: 'block', marginTop: 2 }}>
                    Now viewing: {completionBanner.followOnPlanName}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setCompletionBanner({ show: false, planName: '', action: '', followOnPlanId: null })}
              style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 4 }}
            >
              <X style={{ width: 16, height: 16, color: C.neutral[400] }} />
            </button>
          </div>
        )}
        
        {/* Draft Plan Scenario Mode Banner */}
        {scenarioMode && scenarioSource === 'draft-plan' && draftPlanScenario && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: sp.md, 
            padding: sp.md, 
            marginBottom: sp.md,
            background: C.purple[50], 
            borderRadius: 8, 
            border: `1px solid ${C.purple[300]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: 8, 
                background: C.purple[100], 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Lightbulb style={{ width: 18, height: 18, color: C.purple[600] }} />
              </div>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.purple[800] }}>
                  Scenario Mode: Viewing projected impact
                </span>
                <span style={{ fontSize: '12px', color: C.purple[600], display: 'block' }}>
                  Draft plan "{draftPlanScenario.planName}" — System shows projected state if plan succeeds
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <button 
                onClick={() => onViewInsights()}
                style={{ 
                  padding: `${sp.xs} ${sp.sm}`, 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  background: C.purple[500], 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                View Insights <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
              <button 
                onClick={() => exitDraftPlanScenario && exitDraftPlanScenario()}
                style={{ 
                  padding: `${sp.xs} ${sp.sm}`, 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  background: 'white', 
                  color: C.purple[700], 
                  border: `1px solid ${C.purple[300]}`, 
                  borderRadius: 4, 
                  cursor: 'pointer' 
                }}
              >
                Exit Scenario
              </button>
            </div>
          </div>
        )}
        
        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, marginBottom: sp.md }}>
          {[
            { label: 'Plans This Week', value: stats.totalThisWeek, icon: ClipboardList, color: C.brand },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: CheckCircle, color: C.success },
            { label: 'Avg Duration', value: stats.avgDuration, icon: Clock, color: C.purple },
            { label: 'Active Now', value: stats.active, icon: Zap, color: C.warning }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 12,
                  background: stat.color[100],
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon style={{ width: 24, height: 24, color: stat.color[600] }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 300, color: C.neutral[800] }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: C.neutral[500] }}>{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Current Active Plans (if any exist) */}
        {activePlans.length > 0 && (
          <Card style={{ marginBottom: sp.md, background: C.success[50], border: `2px solid ${C.success[300]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp.sm }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <Zap style={{ width: 18, height: 18, color: C.success[600] }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: C.success[700], textTransform: 'uppercase' }}>
                  Active Plan{activePlans.length > 1 ? 's' : ''} ({activePlans.length})
                </span>
              </div>
              {activePlans.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, padding: '4px 8px', background: C.warning[100], borderRadius: 4 }}>
                  <AlertTriangle style={{ width: 12, height: 12, color: C.warning[600] }} />
                  <span style={{ fontSize: '11px', color: C.warning[700] }}>Multiple plans active - monitor for conflicts</span>
                </div>
              )}
            </div>
            
            {/* List all active plans */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {activePlans.map((plan, idx) => (
                <div key={plan.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: sp.sm,
                  background: 'white',
                  borderRadius: 8,
                  border: `1px solid ${C.success[200]}`
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], margin: 0 }}>{plan.name}</h3>
                      <span style={{
                        padding: '3px 8px',
                        fontSize: '10px',
                        fontWeight: 600,
                        background: plan.priority === 'critical' ? C.error[100] : plan.priority === 'high' ? C.warning[100] : C.neutral[100],
                        color: plan.priority === 'critical' ? C.error[700] : plan.priority === 'high' ? C.warning[700] : C.neutral[600],
                        borderRadius: 4,
                        textTransform: 'uppercase'
                      }}>
                        {plan.priority}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, fontSize: '12px', color: C.neutral[500] }}>
                      <span>👤 {plan.createdBy.name}</span>
                      <span>📅 {plan.shiftContext} Shift</span>
                      <span>🕐 Target: {plan.targetCompletion}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                        <div style={{ width: 80, height: 6, background: C.neutral[200], borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${plan.progress}%`, background: C.success[500], borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: C.success[700] }}>{plan.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => viewPlan(plan.id)}
                    style={{
                      padding: `${sp.xs} ${sp.md}`,
                      fontSize: '12px',
                      fontWeight: 500,
                      background: C.success[600],
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    View
                    <ChevronRight style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* No Active Plan - Empty State */}
        {activePlans.length === 0 && (
          <Card style={{ marginBottom: sp.md, background: C.neutral[50], border: `2px dashed ${C.neutral[300]}`, textAlign: 'center', padding: sp.xl }}>
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: C.neutral[100],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              marginBottom: sp.md
            }}>
              <ClipboardList style={{ width: 32, height: 32, color: C.neutral[400] }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: C.neutral[700], margin: 0, marginBottom: sp.xs }}>
              No Active Plan
            </h3>
            <p style={{ fontSize: '14px', color: C.neutral[500], margin: 0, marginBottom: sp.lg }}>
              Create a new plan or apply one from your Playbook to get started
            </p>
            <div style={{ display: 'flex', gap: sp.md, justifyContent: 'center' }}>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: `${sp.sm} ${sp.lg}`,
                  fontSize: '13px',
                  fontWeight: 500,
                  background: C.success[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.xs
                }}
              >
                <Zap style={{ width: 14, height: 14 }} />
                Create New Plan
              </button>
              <button
                style={{
                  padding: `${sp.sm} ${sp.lg}`,
                  fontSize: '13px',
                  fontWeight: 500,
                  background: 'white',
                  color: C.purple[600],
                  border: `1px solid ${C.purple[200]}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.xs
                }}
              >
                <Lightbulb style={{ width: 14, height: 14 }} />
                Apply from Playbook
              </button>
            </div>
          </Card>
        )}
        
        {/* Plans List */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], margin: 0 }}>All Plans</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.neutral[400] }} />
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 32px',
                    fontSize: '12px',
                    border: `1px solid ${C.neutral[200]}`,
                    borderRadius: 6,
                    width: 200
                  }}
                />
              </div>
              
              {/* Create button */}
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: C.brand[500],
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span style={{ fontSize: '14px' }}>+</span>
                Create Plan
              </button>
            </div>
          </div>
          
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: sp.md, borderBottom: `1px solid ${C.neutral[200]}` }}>
            {[
              { id: 'all', label: 'All', count: allPlans.length },
              { id: 'active', label: 'Active', count: stats.active },
              { id: 'draft', label: 'Drafts', count: stats.drafts },
              { id: 'pending-approval', label: 'Pending', count: stats.pending },
              { id: 'completed', label: 'Completed', count: allPlans.filter(p => p.status === 'completed').length },
              { id: 'partial', label: 'Partial', count: allPlans.filter(p => p.status === 'partial').length },
              { id: 'abandoned', label: 'Abandoned', count: allPlans.filter(p => p.status === 'abandoned').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: `${sp.sm} ${sp.md}`,
                  fontSize: '12px',
                  fontWeight: 500,
                  color: statusFilter === tab.id ? C.neutral[900] : C.neutral[500],
                  background: 'transparent',
                  border: 'none',
                  borderBottom: statusFilter === tab.id ? `2px solid ${C.neutral[900]}` : '2px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {tab.label}
                <span style={{
                  padding: '2px 6px',
                  fontSize: '10px',
                  background: statusFilter === tab.id ? C.neutral[200] : C.neutral[100],
                  color: C.neutral[600],
                  borderRadius: 10
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Plans Table */}
          <div style={{ border: `1px solid ${C.neutral[200]}`, borderRadius: 8, overflow: 'hidden' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 100px 90px 80px 70px 70px 50px',
              gap: sp.sm,
              padding: `${sp.sm} ${sp.md}`,
              background: C.neutral[50],
              borderBottom: `1px solid ${C.neutral[200]}`,
              fontSize: '11px',
              fontWeight: 600,
              color: C.neutral[500],
              textTransform: 'uppercase'
            }}>
              <span>Plan Name</span>
              <span>Status</span>
              <span>Outcome</span>
              <span>Duration</span>
              <span>Shift</span>
              <span>Date</span>
              <span></span>
            </div>
            
            {/* Table Rows */}
            {filteredPlans.length === 0 ? (
              <div style={{ padding: sp.xl, textAlign: 'center', color: C.neutral[500] }}>
                No plans found matching your criteria
              </div>
            ) : (
              filteredPlans.map(plan => {
                const status = statusConfig[plan.status];
                const outcome = plan.outcome ? outcomeConfig[plan.outcome] : null;
                const OutcomeIcon = outcome?.icon;
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => viewPlan(plan.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 100px 90px 80px 70px 70px 50px',
                      gap: sp.sm,
                      padding: `${sp.sm} ${sp.md}`,
                      borderBottom: `1px solid ${C.neutral[100]}`,
                      fontSize: '13px',
                      color: C.neutral[700],
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    {/* Plan Name */}
                    <div>
                      <div style={{ fontWeight: 500, color: C.neutral[800], marginBottom: 2 }}>{plan.name}</div>
                      <div style={{ fontSize: '11px', color: C.neutral[500] }}>{plan.createdBy.name}</div>
                    </div>
                    
                    {/* Status */}
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: status.bg,
                      color: status.text,
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      display: 'inline-block',
                      width: 'fit-content'
                    }}>
                      {status.label}
                    </span>
                    
                    {/* Outcome */}
                    {outcome ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: outcome.color }}>
                        <OutcomeIcon style={{ width: 14, height: 14 }} />
                        <span style={{ fontSize: '12px' }}>{outcome.label}</span>
                      </div>
                    ) : (
                      <span style={{ color: C.neutral[400] }}>—</span>
                    )}
                    
                    {/* Duration */}
                    <span style={{ color: plan.duration ? C.neutral[600] : C.neutral[400] }}>
                      {plan.duration || '—'}
                    </span>
                    
                    {/* Shift */}
                    <span>{plan.shiftContext}</span>
                    
                    {/* Date */}
                    <span>{plan.date}</span>
                    
                    {/* Action */}
                    <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                  </div>
                );
              })
            )}
          </div>
        </Card>
        
        {/* Create Plan Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <div style={{ width: 640, maxHeight: '90vh', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: sp.md, borderBottom: `1px solid ${C.neutral[200]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: C.success[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap style={{ width: 20, height: 20, color: C.success[600] }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], display: 'block' }}>Create New Plan</span>
                    <span style={{ fontSize: '12px', color: C.neutral[500] }}>Define tasks and assign resources</span>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  <X style={{ width: 18, height: 18, color: C.neutral[600] }} />
                </button>
              </div>
              
              {/* Conflict Warning (if active plans exist) */}
              {activePlans.length > 0 && (
                <div style={{ padding: sp.md, background: C.warning[50], borderBottom: `1px solid ${C.warning[200]}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                    <AlertTriangle style={{ width: 20, height: 20, color: C.warning[600], flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.warning[800], margin: 0, marginBottom: sp.xs }}>
                        {activePlans.length} Active Plan{activePlans.length > 1 ? 's' : ''} in Progress
                      </h4>
                      <p style={{ fontSize: '12px', color: C.warning[700], margin: 0, marginBottom: sp.sm }}>
                        Creating a new plan may cause resource conflicts. Review active plans below and ensure tasks don't overlap.
                      </p>
                      <div style={{ background: 'white', border: `1px solid ${C.warning[200]}`, borderRadius: 6, overflow: 'hidden' }}>
                        {activePlans.map(plan => (
                          <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: sp.sm, borderBottom: `1px solid ${C.warning[100]}` }}>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: 500, color: C.neutral[800] }}>{plan.name}</span>
                              <div style={{ fontSize: '11px', color: C.neutral[500], marginTop: 2 }}>
                                {plan.tasks.length} tasks • {plan.shiftContext} Shift • Target: {plan.targetCompletion}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                              <div style={{ width: 60, height: 6, background: C.neutral[200], borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${plan.progress}%`, background: C.success[500] }} />
                              </div>
                              <span style={{ fontSize: '11px', color: C.neutral[600], width: 35 }}>{plan.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '11px', color: C.warning[600], margin: 0, marginTop: sp.sm, fontStyle: 'italic' }}>
                        Potential conflicts will be flagged when you assign overlapping resources.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: sp.md }}>
                {/* Plan Details */}
                <div style={{ marginBottom: sp.lg }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.sm }}>Plan Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp.md }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600], display: 'block', marginBottom: 4 }}>Plan Name</label>
                      <input type="text" placeholder="e.g., Peak Hour Staffing Adjustment" style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600], display: 'block', marginBottom: 4 }}>Priority</label>
                      <select style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, background: 'white' }}>
                        <option>Normal</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600], display: 'block', marginBottom: 4 }}>Target Completion</label>
                      <select style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, background: 'white' }}>
                        <option>11:00 AM</option>
                        <option>11:30 AM</option>
                        <option>12:00 PM</option>
                        <option>12:30 PM</option>
                        <option>1:00 PM</option>
                        <option>1:30 PM</option>
                        <option>2:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600], display: 'block', marginBottom: 4 }}>Shift Context</label>
                      <select style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, background: 'white' }}>
                        <option>Day Shift</option>
                        <option>Swing Shift</option>
                        <option>Night Shift</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Tasks */}
                <div style={{ marginBottom: sp.lg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800], margin: 0 }}>Tasks</h4>
                    <button style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500, background: C.brand[50], color: C.brand[600], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>+</span> Add Task
                    </button>
                  </div>
                  
                  {/* Empty task placeholder */}
                  <div style={{ background: C.neutral[50], border: `2px dashed ${C.neutral[300]}`, borderRadius: 8, padding: sp.lg, textAlign: 'center' }}>
                    <ClipboardList style={{ width: 32, height: 32, color: C.neutral[400], margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '13px', color: C.neutral[500], margin: 0, marginBottom: sp.sm }}>No tasks added yet</p>
                    <p style={{ fontSize: '12px', color: C.neutral[400], margin: 0 }}>
                      Add tasks to define what needs to be done
                    </p>
                  </div>
                </div>
                
                {/* Success Criteria */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.sm }}>Success Criteria (Optional)</h4>
                  <div style={{ display: 'flex', gap: sp.sm }}>
                    <input type="text" placeholder="e.g., Throughput reaches 850 orders/hr" style={{ flex: 1, padding: '10px 12px', fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6 }} />
                    <button style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 500, background: C.neutral[100], color: C.neutral[600], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: sp.md, borderTop: `1px solid ${C.neutral[200]}`, background: C.neutral[50] }}>
                <button onClick={() => setShowCreateModal(false)} style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.neutral[700], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}>
                  Cancel
                </button>
                <div style={{ display: 'flex', gap: sp.sm }}>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.neutral[600], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}>
                    Save as Draft
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, background: C.success[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Zap style={{ width: 14, height: 14 }} />
                    Create & Activate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  // ===== DETAIL VIEW =====
  if (viewMode === 'detail' && selectedPlan) {
    const todoTasks = getTasksByStatus(selectedPlan.tasks, 'todo');
    const inProgressTasks = getTasksByStatus(selectedPlan.tasks, 'in-progress');
    const doneTasks = getTasksByStatus(selectedPlan.tasks, 'done');
    const incompleteTasks = getTasksByStatus(selectedPlan.tasks, 'incomplete');
    const isActivePlan = selectedPlan.status === 'active';
    const isDraftPlan = selectedPlan.status === 'draft';
    const status = statusConfig[selectedPlan.status];
    
    return (
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: sp.md }}>
          <button
            onClick={() => { setViewMode('list'); setSelectedPlanId(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: sp.xs,
              padding: `${sp.xs} ${sp.sm}`,
              fontSize: '13px',
              color: C.neutral[600],
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 4
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.brand[600]}
            onMouseLeave={(e) => e.currentTarget.style.color = C.neutral[600]}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
            All Plans
          </button>
        </div>
        
        {/* Draft Plan Scenario Mode Banner */}
        {isDraftPlan && scenarioMode && scenarioSource === 'draft-plan' && draftPlanScenario?.planId === selectedPlan.id && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: sp.md, 
            padding: sp.md, 
            marginBottom: sp.md,
            background: C.purple[50], 
            borderRadius: 8, 
            border: `1px solid ${C.purple[300]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: 8, 
                background: C.purple[100], 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Lightbulb style={{ width: 18, height: 18, color: C.purple[600] }} />
              </div>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.purple[800] }}>
                  Scenario Mode Active
                </span>
                <span style={{ fontSize: '12px', color: C.purple[600], display: 'block' }}>
                  Dashboard shows projected system state if this plan succeeds. Execute to go live.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <button 
                onClick={() => onViewInsights()}
                style={{ 
                  padding: `${sp.xs} ${sp.sm}`, 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  background: C.purple[500], 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                View Insights <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
              <button 
                onClick={() => exitDraftPlanScenario && exitDraftPlanScenario()}
                style={{ 
                  padding: `${sp.xs} ${sp.sm}`, 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  background: 'white', 
                  color: C.purple[700], 
                  border: `1px solid ${C.purple[300]}`, 
                  borderRadius: 4, 
                  cursor: 'pointer' 
                }}
              >
                Exit Scenario
              </button>
            </div>
          </div>
        )}
        
        {/* 1. HERO CARD */}
        <Card style={{ marginBottom: sp.md }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.sm }}>
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: C.neutral[800], margin: 0 }}>
              {selectedPlan.name}
            </h2>
            <span style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              background: status.bg,
              color: status.text,
              borderRadius: 12,
              textTransform: 'uppercase'
            }}>
              {status.label}
            </span>
            <span style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              background: selectedPlan.priority === 'critical' ? C.error[100] : selectedPlan.priority === 'high' ? C.warning[100] : C.neutral[100],
              color: selectedPlan.priority === 'critical' ? C.error[700] : selectedPlan.priority === 'high' ? C.warning[700] : C.neutral[600],
              borderRadius: 4
            }}>
              {selectedPlan.priority.charAt(0).toUpperCase() + selectedPlan.priority.slice(1)} Priority
            </span>
          </div>
          
          {/* Meta Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, fontSize: '13px', color: C.neutral[600], marginBottom: sp.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users style={{ width: 14, height: 14 }} />
              Created by {selectedPlan.createdBy.name} at {selectedPlan.createdAt}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar style={{ width: 14, height: 14 }} />
              {selectedPlan.shiftContext} Shift
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock style={{ width: 14, height: 14 }} />
              Target: {selectedPlan.targetCompletion}
            </div>
            {selectedPlan.duration && (
              <span>Duration: {selectedPlan.duration}</span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginBottom: sp.md }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600] }}>Progress</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[800] }}>
                {doneTasks.length} of {selectedPlan.tasks.length} tasks complete ({selectedPlan.progress}%)
              </span>
            </div>
            <div style={{ height: 8, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${selectedPlan.progress}%`, 
                background: `linear-gradient(90deg, ${status.color[400]}, ${status.color[500]})`,
                borderRadius: 4,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          {/* Success Criteria */}
          {selectedPlan.successCriteria && (
            <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6, border: `1px solid ${C.neutral[200]}`, marginBottom: sp.md }}>
              <h4 style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[600], margin: 0, marginBottom: sp.sm }}>
                Success Criteria — By {selectedPlan.targetCompletion}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                {selectedPlan.successCriteria.map(criterion => (
                  <div key={criterion.id} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: criterion.met ? C.success[500] : C.neutral[200],
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {criterion.met && <CheckCircle style={{ width: 12, height: 12, color: 'white' }} />}
                    </div>
                    <span style={{ fontSize: '13px', color: criterion.met ? C.success[700] : C.neutral[600], textDecoration: criterion.met ? 'line-through' : 'none' }}>
                      {criterion.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Origin Link */}
          {selectedPlan.origin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: sp.sm, background: C.purple[50], borderRadius: 6, border: `1px solid ${C.purple[200]}`, marginBottom: sp.md }}>
              <Lightbulb style={{ width: 16, height: 16, color: C.purple[500], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', color: C.purple[600], display: 'block' }}>INITIATED FROM</span>
                <span style={{ fontSize: '13px', color: C.purple[700] }}>{selectedPlan.origin.title || selectedPlan.origin.alertTitle}</span>
              </div>
              <button onClick={() => onNavigateToAlert?.(selectedPlan.origin.alertId)} style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 500, background: 'white', color: C.purple[600], border: `1px solid ${C.purple[200]}`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View Context <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            </div>
          )}
          
          {/* Plan Actions (only for active plans) */}
          {isActivePlan && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
              <button 
                onClick={() => setStopPlanModal({ isOpen: true, planId: selectedPlan.id })}
                style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.error[600], border: `1px solid ${C.error[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}
              >
                <X style={{ width: 14, height: 14 }} />
                Stop Plan
              </button>
              <button 
                onClick={() => { setCompletePlanModal({ isOpen: true, planId: selectedPlan.id }); setCompletionNotes(''); setShowExploratoryPreview(false); }}
                style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, background: C.success[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}
              >
                <CheckCircle style={{ width: 14, height: 14 }} />
                Mark Plan Complete
              </button>
            </div>
          )}
          
          {/* Draft Plan Actions */}
          {isDraftPlan && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
              <button 
                onClick={() => {
                  // Delete draft plan
                  setAllPlans(allPlans.filter(p => p.id !== selectedPlan.id));
                  if (exitDraftPlanScenario) exitDraftPlanScenario();
                  setViewMode('list');
                  setSelectedPlanId(null);
                }}
                style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.error[600], border: `1px solid ${C.error[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}
              >
                <Trash2 style={{ width: 14, height: 14 }} />
                Discard Draft
              </button>
              <button 
                onClick={() => {
                  // Execute the draft plan (make it active)
                  setAllPlans(allPlans.map(p => p.id === selectedPlan.id ? {
                    ...p,
                    status: 'active',
                    targetCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                  } : p));
                  if (exitDraftPlanScenario) exitDraftPlanScenario();
                  // Show success message
                  setCompletionBanner({
                    show: true,
                    planName: selectedPlan.name,
                    action: 'executed',
                    followOnPlanId: null
                  });
                  setTimeout(() => setCompletionBanner({ show: false, planName: '', action: '', followOnPlanId: null }), 5000);
                }}
                style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, background: C.success[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}
              >
                <Play style={{ width: 14, height: 14 }} />
                Execute Plan Live
              </button>
            </div>
          )}
        </Card>
        
        {/* 2. PROJECTED IMPACT */}
        {selectedPlan.projectedImpact && (
          <Card style={{ marginBottom: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.md }}>
              Projected Impact
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.sm }}>
              {[
                { key: 'staff', label: 'Staff Score', icon: Users },
                { key: 'zones', label: 'Zone Score', icon: MapPin },
                { key: 'schedule', label: 'Schedule', icon: Calendar },
                { key: 'equip', label: 'Equipment', icon: Wrench }
              ].map(cat => {
                const data = selectedPlan.projectedImpact[cat.key];
                const Icon = cat.icon;
                const isPositive = data.delta > 0;
                const isNegative = data.delta < 0;
                
                return (
                  <div key={cat.key} style={{
                    padding: sp.sm,
                    background: isPositive ? C.success[50] : isNegative ? C.warning[50] : C.neutral[50],
                    border: `1px solid ${isPositive ? C.success[200] : isNegative ? C.warning[200] : C.neutral[200]}`,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: sp.md
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: isPositive ? C.success[100] : isNegative ? C.warning[100] : C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 20, height: 20, color: isPositive ? C.success[600] : isNegative ? C.warning[600] : C.neutral[500] }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: C.neutral[500], marginBottom: 2 }}>{cat.label}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs }}>
                        <span style={{ fontSize: '20px', fontWeight: 500, color: isPositive ? C.success[700] : isNegative ? C.warning[700] : C.neutral[700] }}>{data.projected}</span>
                        <span style={{ fontSize: '12px', color: C.neutral[400] }}>from {data.base}</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: isPositive ? C.success[600] : isNegative ? C.warning[600] : C.neutral[500] }}>
                          ({data.delta > 0 ? '+' : ''}{data.delta})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
        
        {/* 3. TASKS */}
        <Card style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.md }}>
            Tasks
            <span style={{ fontSize: '14px', fontWeight: 400, color: C.neutral[500], marginLeft: sp.sm }}>
              ({selectedPlan.tasks.length})
            </span>
          </h3>
          
          {/* Kanban Board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm }}>
            {/* To Do Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.sm, padding: sp.xs, background: C.neutral[100], borderRadius: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.neutral[400] }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[600] }}>To Do</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[500], background: C.neutral[200], padding: '2px 6px', borderRadius: 10, marginLeft: 'auto' }}>{todoTasks.length}</span>
              </div>
              {todoTasks.map(task => <TaskCard key={task.id} task={task} planId={selectedPlan.id} showActions={isActivePlan} />)}
              {todoTasks.length === 0 && <div style={{ padding: sp.sm, textAlign: 'center', color: C.neutral[400], fontSize: '12px', background: C.neutral[50], borderRadius: 6, border: `1px dashed ${C.neutral[200]}` }}>No pending tasks</div>}
            </div>
            
            {/* In Progress Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.sm, padding: sp.xs, background: C.brand[50], borderRadius: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.brand[500] }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.brand[700] }}>In Progress</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.brand[600], background: C.brand[100], padding: '2px 6px', borderRadius: 10, marginLeft: 'auto' }}>{inProgressTasks.length}</span>
              </div>
              {inProgressTasks.map(task => <TaskCard key={task.id} task={task} planId={selectedPlan.id} showActions={isActivePlan} />)}
              {inProgressTasks.length === 0 && <div style={{ padding: sp.sm, textAlign: 'center', color: C.neutral[400], fontSize: '12px', background: C.neutral[50], borderRadius: 6, border: `1px dashed ${C.neutral[200]}` }}>No active tasks</div>}
            </div>
            
            {/* Done Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.sm, padding: sp.xs, background: C.success[50], borderRadius: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.success[500] }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.success[700] }}>Done</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[600], background: C.success[100], padding: '2px 6px', borderRadius: 10, marginLeft: 'auto' }}>{doneTasks.length + incompleteTasks.length}</span>
              </div>
              {doneTasks.map(task => <TaskCard key={task.id} task={task} planId={selectedPlan.id} showActions={false} />)}
              {incompleteTasks.map(task => <TaskCard key={task.id} task={task} planId={selectedPlan.id} showActions={false} />)}
              {doneTasks.length === 0 && incompleteTasks.length === 0 && <div style={{ padding: sp.sm, textAlign: 'center', color: C.neutral[400], fontSize: '12px', background: C.neutral[50], borderRadius: 6, border: `1px dashed ${C.neutral[200]}` }}>No completed tasks</div>}
            </div>
          </div>
        </Card>
        
        {/* Task Detail Modal */}
        <TaskDetailModal />
        
        {/* 4. ACTIVITY */}
        <Card style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.md }}>
            Activity
          </h3>
          
          {/* Comment Input (active plans only) */}
          {isActivePlan && (
            <div style={{ display: 'flex', gap: sp.sm, marginBottom: sp.md }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                placeholder="Add a comment or update..."
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px', border: `1px solid ${C.neutral[200]}`, borderRadius: 6 }}
              />
              <button
                onClick={addComment}
                style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 500, background: C.brand[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Post
              </button>
            </div>
          )}
          
          {/* Activity Timeline */}
          <div style={{ borderLeft: `2px solid ${C.neutral[200]}`, marginLeft: sp.sm, paddingLeft: sp.md }}>
            {activities.map((activity, idx) => (
              <div key={activity.id} style={{ 
                position: 'relative',
                paddingBottom: idx < activities.length - 1 ? sp.md : 0,
                marginBottom: idx < activities.length - 1 ? sp.sm : 0
              }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: -22,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: activity.type === 'metric' ? C.success[500] : activity.type === 'comment' ? C.brand[500] : C.neutral[400],
                  border: '2px solid white'
                }} />
                
                {activity.type === 'comment' ? (
                  <div style={{ background: C.neutral[50], padding: sp.sm, borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: C.neutral[700] }}>{activity.user}</span>
                      <span style={{ fontSize: '11px', color: C.neutral[400] }}>{activity.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: C.neutral[600] }}>{activity.content}</p>
                  </div>
                ) : activity.type === 'status' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: C.neutral[600] }}>
                      <strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong>
                    </span>
                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>{activity.time}</span>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: C.success[50],
                    padding: sp.sm,
                    borderRadius: 6
                  }}>
                    <span style={{ fontSize: '13px', color: C.success[700], fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TrendingUp style={{ width: 14, height: 14 }} />
                      {activity.content}
                    </span>
                    <span style={{ fontSize: '11px', color: C.success[600] }}>{activity.time}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        {/* Shift Handoff Panel (only for active plans) */}
        {isActivePlan && (
          <Card style={{ marginBottom: sp.md, background: C.purple[50], border: `1px solid ${C.purple[200]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <RefreshCw style={{ width: 18, height: 18, color: C.purple[600] }} />
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.purple[800], margin: 0 }}>Shift Handoff</h3>
              </div>
              <span style={{ fontSize: '12px', color: C.purple[600], fontWeight: 500 }}>Day → Swing</span>
            </div>
            
            {!showHandoff ? (
              <button
                onClick={() => setShowHandoff(true)}
                style={{ width: '100%', padding: sp.md, fontSize: '14px', fontWeight: 500, background: C.purple[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.sm }}
              >
                <Clock style={{ width: 16, height: 16 }} />
                Prepare Handoff (in 45 min)
              </button>
            ) : handoffAccepted ? (
              <div style={{ padding: sp.md, background: C.success[100], borderRadius: 6, textAlign: 'center' }}>
                <CheckCircle style={{ width: 24, height: 24, color: C.success[600], margin: '0 auto 8px' }} />
                <p style={{ fontSize: '14px', fontWeight: 500, color: C.success[700], margin: 0 }}>Handoff Submitted</p>
                <p style={{ fontSize: '12px', color: C.success[600], margin: 0, marginTop: 4 }}>Swing shift lead notified</p>
              </div>
            ) : (
              <div>
                <div style={{ background: 'white', borderRadius: 6, padding: sp.md, marginBottom: sp.sm }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], margin: 0, marginBottom: sp.xs, textTransform: 'uppercase' }}>Handoff Notes</p>
                  <textarea
                    defaultValue="Throughput recovering well. Z07 still ramping up - should hit target by 15:30. Watch for equipment availability in Z04."
                    style={{ width: '100%', padding: sp.sm, fontSize: '13px', border: `1px solid ${C.neutral[200]}`, borderRadius: 6, resize: 'vertical', minHeight: 80, fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: sp.sm }}>
                  <button onClick={() => setShowHandoff(false)} style={{ flex: 1, padding: sp.md, fontSize: '13px', fontWeight: 500, background: 'white', color: C.neutral[600], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={() => setHandoffAccepted(true)} style={{ flex: 1, padding: sp.md, fontSize: '13px', fontWeight: 500, background: C.success[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    Submit Handoff
                    <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {/* Stop Plan Modal */}
        {stopPlanModal.isOpen && selectedPlan && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <div style={{ width: 560, maxHeight: '90vh', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: sp.md, background: C.error[50], borderBottom: `1px solid ${C.error[200]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: C.error[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X style={{ width: 20, height: 20, color: C.error[600] }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800], display: 'block' }}>Stop Plan</span>
                    <span style={{ fontSize: '12px', color: C.neutral[500] }}>{selectedPlan.name}</span>
                  </div>
                </div>
                <button onClick={() => setStopPlanModal({ isOpen: false, planId: null })} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  <X style={{ width: 18, height: 18, color: C.neutral[600] }} />
                </button>
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: sp.md }}>
                {/* Tasks Status Summary */}
                <div style={{ marginBottom: sp.md }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.sm }}>Tasks Status</h4>
                  <div style={{ background: C.neutral[50], border: `1px solid ${C.neutral[200]}`, borderRadius: 8, padding: sp.sm }}>
                    {selectedPlan.tasks.map(task => {
                      const isDone = task.status === 'done';
                      const isInProgress = task.status === 'in-progress';
                      return (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: sp.xs, borderBottom: `1px solid ${C.neutral[100]}` }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDone ? C.success[500] : isInProgress ? C.brand[500] : C.neutral[300], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isDone && <CheckCircle style={{ width: 12, height: 12, color: 'white' }} />}
                            {isInProgress && <Clock style={{ width: 12, height: 12, color: 'white' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '13px', color: C.neutral[700] }}>{task.title}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: isDone ? C.success[600] : isInProgress ? C.brand[600] : C.neutral[500], fontWeight: 500 }}>
                            {isDone ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: '12px', color: C.neutral[500], margin: 0, marginTop: sp.xs }}>
                    Changes from completed tasks will remain in effect.
                  </p>
                </div>
                
                {/* Reason */}
                <div style={{ marginBottom: sp.md }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.sm }}>Reason for Stopping</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                    {[
                      { id: 'changed', label: 'Situation changed (no longer needed)' },
                      { id: 'not-working', label: 'Plan not achieving desired outcome' },
                      { id: 'priority', label: 'Higher priority emerged' },
                      { id: 'conflict', label: 'Resource conflict' },
                      { id: 'other', label: 'Other' }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: sp.xs, cursor: 'pointer', borderRadius: 4 }} onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[50]} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <input type="radio" name="stopReason" checked={stopReason === opt.id} onChange={() => setStopReason(opt.id)} />
                        <span style={{ fontSize: '13px', color: C.neutral[700] }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Notes */}
                <div style={{ marginBottom: sp.md }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800], margin: 0, marginBottom: sp.sm }}>Notes (for next plan)</h4>
                  <textarea
                    value={stopNotes}
                    onChange={(e) => setStopNotes(e.target.value)}
                    placeholder="Describe what happened and any recommendations for the next plan..."
                    style={{ width: '100%', padding: sp.sm, fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, resize: 'vertical', minHeight: 80, fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                
                {/* Suggested Next Steps */}
                <div style={{ background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 8, padding: sp.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.sm }}>
                    <Lightbulb style={{ width: 16, height: 16, color: C.brand[600] }} />
                    <h4 style={{ fontSize: '13px', fontWeight: 500, color: C.brand[800], margin: 0 }}>Suggested Next Steps</h4>
                  </div>
                  <p style={{ fontSize: '12px', color: C.brand[700], margin: 0, marginBottom: sp.sm }}>
                    Based on current state, you may want to:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: '12px', color: C.brand[700] }}>
                    <li>Review incomplete tasks and current system state</li>
                    <li>Create a new plan addressing the updated situation</li>
                    <li>Check Insights for new recommendations</li>
                  </ul>
                </div>
              </div>
              
              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: sp.md, borderTop: `1px solid ${C.neutral[200]}`, background: C.neutral[50] }}>
                <button onClick={() => setStopPlanModal({ isOpen: false, planId: null })} style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.neutral[700], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const completedTasks = selectedPlan.tasks.filter(t => t.status === 'done').length;
                    const newStatus = completedTasks > 0 ? 'partial' : 'abandoned';
                    setAllPlans(allPlans.map(p => p.id === selectedPlan.id ? { ...p, status: newStatus, outcome: newStatus, stopReason: stopReason, notes: stopNotes, duration: '—' } : p));
                    setStopPlanModal({ isOpen: false, planId: null });
                    setStopReason('');
                    setStopNotes('');
                    setViewMode('list');
                    setSelectedPlanId(null);
                  }}
                  disabled={!stopReason}
                  style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, background: stopReason ? C.error[500] : C.neutral[300], color: 'white', border: 'none', borderRadius: 6, cursor: stopReason ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: sp.xs }}
                >
                  Stop Plan
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Complete Plan Modal */}
        {completePlanModal.isOpen && selectedPlan && (() => {
          // Calculate task completion stats
          const tasks = selectedPlan.tasks || [];
          const doneTasks = tasks.filter(t => t.status === 'done');
          const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
          const todoTasks = tasks.filter(t => t.status === 'todo');
          
          // Calculate action stats per task
          const getTaskActionStats = (task) => {
            const actions = task.actions || [];
            const applied = actions.filter(a => a.status === 'applied').length;
            const total = actions.length;
            return { applied, total, pending: total - applied };
          };
          
          // Total actions across all tasks
          const totalActions = tasks.reduce((sum, t) => sum + (t.actions?.length || 0), 0);
          const appliedActions = tasks.reduce((sum, t) => sum + (t.actions?.filter(a => a.status === 'applied').length || 0), 0);
          const pendingActions = totalActions - appliedActions;
          
          // Success criteria stats
          const criteria = selectedPlan.successCriteria || [];
          const metCriteria = criteria.filter(c => c.met).length;
          const unmetCriteria = criteria.length - metCriteria;
          
          // Determine completion state
          const hasIncompleteWork = pendingActions > 0 || todoTasks.length > 0 || inProgressTasks.length > 0 || unmetCriteria > 0;
          const isFullSuccess = !hasIncompleteWork && criteria.length > 0 && metCriteria === criteria.length;
          
          // Exploratory scenario preview data (would be computed from actual system state)
          const exploratoryPreview = {
            before: { staff: 76, zones: 74, schedule: 91, equip: 94 },
            after: { staff: 82, zones: 78, schedule: 89, equip: 92 },
            alertsResolved: 2,
            alertsNew: 1,
            remainingRootCauses: [
              { id: 'rc1', title: 'Z04 putaway bottleneck', severity: 'medium' },
              { id: 'rc2', title: 'Z07 partial activation', severity: 'low' }
            ]
          };
          
          const handleCompletePlan = (followOnAction) => {
            // Determine outcome based on criteria
            const outcome = isFullSuccess ? 'success' : 'partial';
            
            // Update the plan
            setAllPlans(allPlans.map(p => p.id === selectedPlan.id ? {
              ...p,
              status: 'completed',
              outcome,
              completionNotes,
              duration: '2h 15m',
              completedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            } : p));
            
            let newPlanId = null;
            
            if (followOnAction === 'follow-on' || followOnAction === 'handoff') {
              // Create follow-on plan with incomplete work
              const incompleteTasksCopy = [...inProgressTasks, ...todoTasks].map(t => ({
                ...t,
                id: `followon-${t.id}`,
                status: 'todo',
                startedAt: null,
                completedAt: null,
                actions: (t.actions || []).filter(a => a.status !== 'applied').map(a => ({
                  ...a,
                  id: `followon-${a.id}`,
                  status: 'pending',
                  actual: null,
                  appliedAt: null
                }))
              }));
              
              // Add tasks for unmet criteria
              const criteriaTasksCopy = criteria.filter(c => !c.met).map((c, idx) => ({
                id: `followon-criteria-${idx}`,
                title: `Address: ${c.text}`,
                status: 'todo',
                assignee: { name: 'TBD' },
                type: 'follow-up',
                actions: []
              }));
              
              const isHandoff = followOnAction === 'handoff';
              const nextShift = 'Swing'; // Would be calculated based on current shift
              
              const newPlan = {
                id: `plan-${isHandoff ? 'handoff' : 'followon'}-${Date.now()}`,
                name: isHandoff ? `[Handoff] ${selectedPlan.name}` : `Follow-on: ${selectedPlan.name}`,
                status: 'draft',
                priority: selectedPlan.priority,
                progress: 0,
                createdAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                createdBy: isHandoff ? { name: `${nextShift} Shift Lead`, role: 'Shift Lead' } : selectedPlan.createdBy,
                targetCompletion: '—',
                shiftContext: isHandoff ? nextShift : 'Day',
                date: 'Dec 19',
                duration: null,
                outcome: null,
                origin: {
                  type: isHandoff ? 'handoff' : 'follow-on',
                  title: isHandoff ? `Handed off from: ${selectedPlan.name}` : `Follow-on from: ${selectedPlan.name}`,
                  parentPlanId: selectedPlan.id,
                  fromShift: isHandoff ? 'Day' : undefined
                },
                successCriteria: criteria.filter(c => !c.met).map(c => ({ ...c, id: `followon-${c.id}`, met: false })),
                tasks: [...incompleteTasksCopy, ...criteriaTasksCopy],
                projectedImpact: selectedPlan.projectedImpact
              };
              
              newPlanId = newPlan.id;
              setAllPlans(prev => [newPlan, ...prev]);
              setSelectedPlanId(newPlan.id);
              
              // Activate scenario mode for draft plan
              if (activateDraftPlanScenario) {
                activateDraftPlanScenario(newPlan.id, newPlan.name, newPlan.projectedImpact);
              }
              
              // Show completion banner
              setCompletionBanner({
                show: true,
                planName: selectedPlan.name,
                action: isHandoff ? 'handoff' : 'follow-on',
                followOnPlanId: newPlan.id,
                followOnPlanName: newPlan.name
              });
              
              // Auto-hide banner after 8 seconds
              setTimeout(() => setCompletionBanner({ show: false, planName: '', action: '', followOnPlanId: null }), 8000);
            } else {
              // Close anyway or complete (full success)
              setCompletionBanner({
                show: true,
                planName: selectedPlan.name,
                action: followOnAction === 'close' ? 'closed' : 'completed',
                followOnPlanId: null
              });
              setTimeout(() => setCompletionBanner({ show: false, planName: '', action: '', followOnPlanId: null }), 5000);
            }
            
            setCompletePlanModal({ isOpen: false, planId: null });
            setCompletionNotes('');
            setShowExploratoryPreview(false);
            
            if (followOnAction !== 'follow-on' && followOnAction !== 'handoff') {
              setViewMode('list');
              setSelectedPlanId(null);
            }
          };
          
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setCompletePlanModal({ isOpen: false, planId: null })}>
              <div style={{ width: 640, maxHeight: '90vh', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ padding: sp.md, borderBottom: `1px solid ${C.neutral[200]}`, background: C.success[50] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                        <CheckCircle style={{ width: 20, height: 20, color: C.success[600] }} />
                        <span style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[800] }}>Complete Plan</span>
                      </div>
                      <p style={{ fontSize: '14px', color: C.neutral[600], margin: 0 }}>{selectedPlan.name}</p>
                    </div>
                    <button onClick={() => setCompletePlanModal({ isOpen: false, planId: null })} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                      <X style={{ width: 18, height: 18, color: C.neutral[500] }} />
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: sp.md }}>
                  {/* Tasks Summary */}
                  <div style={{ marginBottom: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 8, border: `1px solid ${C.neutral[200]}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: C.neutral[700], margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tasks Summary</h4>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: doneTasks.length === tasks.length ? C.success[600] : C.warning[600] }}>
                        {doneTasks.length}/{tasks.length} ({tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                      {tasks.map(task => {
                        const stats = getTaskActionStats(task);
                        const statusIcon = task.status === 'done' ? CheckCircle : task.status === 'in-progress' ? Clock : task.status === 'incomplete' ? X : Circle;
                        const StatusIcon = statusIcon;
                        const statusColor = task.status === 'done' ? C.success : task.status === 'in-progress' ? C.brand : task.status === 'incomplete' ? C.error : C.neutral;
                        
                        return (
                          <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm, padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.neutral[200]}` }}>
                            <StatusIcon style={{ width: 16, height: 16, color: statusColor[500], marginTop: 2, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', fontWeight: 500, color: C.neutral[800] }}>{task.title}</div>
                              <div style={{ fontSize: '11px', color: C.neutral[500], marginTop: 2 }}>
                                {stats.total > 0 ? (
                                  <span style={{ color: stats.applied === stats.total ? C.success[600] : stats.applied > 0 ? C.warning[600] : C.neutral[500] }}>
                                    {stats.applied}/{stats.total} actions applied
                                    {stats.pending > 0 && <span style={{ color: C.warning[600] }}> · {stats.pending} pending</span>}
                                  </span>
                                ) : (
                                  <span>No actions defined</span>
                                )}
                              </div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: statusColor[600], textTransform: 'capitalize' }}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Success Criteria */}
                  {criteria.length > 0 && (
                    <div style={{ marginBottom: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 8, border: `1px solid ${C.neutral[200]}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: C.neutral[700], margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Success Criteria</h4>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: metCriteria === criteria.length ? C.success[600] : C.warning[600] }}>
                          {metCriteria}/{criteria.length} met
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                        {criteria.map(c => (
                          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${c.met ? C.success[200] : C.warning[200]}` }}>
                            {c.met ? (
                              <CheckCircle style={{ width: 16, height: 16, color: C.success[500], flexShrink: 0 }} />
                            ) : (
                              <X style={{ width: 16, height: 16, color: C.warning[500], flexShrink: 0 }} />
                            )}
                            <span style={{ fontSize: '13px', color: c.met ? C.success[700] : C.warning[700], flex: 1 }}>{c.text}</span>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: c.met ? C.success[600] : C.warning[600] }}>
                              {c.met ? 'Met' : 'Not Met'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Completion Notes */}
                  <div style={{ marginBottom: sp.md }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: C.neutral[700], marginBottom: sp.xs }}>Completion Notes</label>
                    <textarea
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      placeholder="Add any notes about the plan execution, lessons learned, or context for future reference..."
                      rows={3}
                      style={{ width: '100%', padding: sp.sm, fontSize: '13px', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                  
                  {/* Incomplete Work Warning */}
                  {hasIncompleteWork && (
                    <div style={{ marginBottom: sp.md, padding: sp.md, background: C.warning[50], borderRadius: 8, border: `1px solid ${C.warning[200]}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm, marginBottom: sp.md }}>
                        <AlertTriangle style={{ width: 20, height: 20, color: C.warning[600], flexShrink: 0 }} />
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: C.warning[800], margin: 0, marginBottom: 4 }}>Incomplete Work Detected</h4>
                          <p style={{ fontSize: '12px', color: C.warning[700], margin: 0 }}>
                            {pendingActions > 0 && `${pendingActions} actions pending`}
                            {pendingActions > 0 && (todoTasks.length > 0 || inProgressTasks.length > 0) && ' · '}
                            {(todoTasks.length + inProgressTasks.length) > 0 && `${todoTasks.length + inProgressTasks.length} tasks not completed`}
                            {((pendingActions > 0) || (todoTasks.length + inProgressTasks.length > 0)) && unmetCriteria > 0 && ' · '}
                            {unmetCriteria > 0 && `${unmetCriteria} criteria unmet`}
                          </p>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '13px', color: C.neutral[700], marginBottom: sp.sm }}>What would you like to do with the remaining work?</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm }}>
                        <button
                          onClick={() => handleCompletePlan('follow-on')}
                          style={{ padding: sp.sm, background: 'white', border: `1px solid ${C.brand[300]}`, borderRadius: 6, cursor: 'pointer', textAlign: 'center' }}
                        >
                          <ClipboardList style={{ width: 20, height: 20, color: C.brand[600], margin: '0 auto 4px' }} />
                          <div style={{ fontSize: '12px', fontWeight: 600, color: C.brand[700] }}>Create Follow-On</div>
                          <div style={{ fontSize: '10px', color: C.neutral[500] }}>New plan with remaining work</div>
                        </button>
                        <button
                          onClick={() => handleCompletePlan('handoff')}
                          style={{ padding: sp.sm, background: 'white', border: `1px solid ${C.purple[300]}`, borderRadius: 6, cursor: 'pointer', textAlign: 'center' }}
                        >
                          <RefreshCw style={{ width: 20, height: 20, color: C.purple[600], margin: '0 auto 4px' }} />
                          <div style={{ fontSize: '12px', fontWeight: 600, color: C.purple[700] }}>Hand Off</div>
                          <div style={{ fontSize: '10px', color: C.neutral[500] }}>Transfer to next shift</div>
                        </button>
                        <button
                          onClick={() => handleCompletePlan('close')}
                          style={{ padding: sp.sm, background: 'white', border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer', textAlign: 'center' }}
                        >
                          <CheckCircle style={{ width: 20, height: 20, color: C.neutral[500], margin: '0 auto 4px' }} />
                          <div style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[700] }}>Close Anyway</div>
                          <div style={{ fontSize: '10px', color: C.neutral[500] }}>Document and archive</div>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Exploratory Scenario Section */}
                  <div style={{ padding: sp.md, background: C.purple[50], borderRadius: 8, border: `1px solid ${C.purple[200]}` }}>
                    <div 
                      onClick={() => setShowExploratoryPreview(!showExploratoryPreview)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <Lightbulb style={{ width: 20, height: 20, color: C.purple[600] }} />
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: C.purple[800], margin: 0 }}>Run Exploratory Scenario</h4>
                          <p style={{ fontSize: '12px', color: C.purple[600], margin: 0 }}>See updated system state and new Insights based on changes made</p>
                        </div>
                      </div>
                      <ChevronRight style={{ width: 18, height: 18, color: C.purple[500], transform: showExploratoryPreview ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                    </div>
                    
                    {showExploratoryPreview && (
                      <div style={{ marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.purple[200]}` }}>
                        {/* Score Changes */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm, marginBottom: sp.md }}>
                          {[
                            { key: 'staff', label: 'Staff', icon: Users },
                            { key: 'zones', label: 'Zones', icon: MapPin },
                            { key: 'schedule', label: 'Schedule', icon: Calendar },
                            { key: 'equip', label: 'Equipment', icon: Wrench }
                          ].map(cat => {
                            const before = exploratoryPreview.before[cat.key];
                            const after = exploratoryPreview.after[cat.key];
                            const delta = after - before;
                            const Icon = cat.icon;
                            
                            return (
                              <div key={cat.key} style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.purple[200]}`, textAlign: 'center' }}>
                                <Icon style={{ width: 14, height: 14, color: C.purple[500], marginBottom: 4 }} />
                                <div style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{cat.label}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                  <span style={{ fontSize: '12px', color: C.neutral[400] }}>{before}</span>
                                  <ArrowRight style={{ width: 10, height: 10, color: C.neutral[300] }} />
                                  <span style={{ fontSize: '14px', fontWeight: 600, color: delta > 0 ? C.success[600] : delta < 0 ? C.warning[600] : C.neutral[700] }}>{after}</span>
                                </div>
                                {delta !== 0 && (
                                  <span style={{ fontSize: '10px', color: delta > 0 ? C.success[600] : C.warning[600] }}>
                                    ({delta > 0 ? '+' : ''}{delta})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Alerts Summary */}
                        <div style={{ display: 'flex', gap: sp.md, marginBottom: sp.md }}>
                          <div style={{ flex: 1, padding: sp.sm, background: C.success[50], borderRadius: 6, border: `1px solid ${C.success[200]}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                              <CheckCircle style={{ width: 14, height: 14, color: C.success[600] }} />
                              <span style={{ fontSize: '12px', color: C.success[700] }}><strong>{exploratoryPreview.alertsResolved}</strong> alerts resolved</span>
                            </div>
                          </div>
                          <div style={{ flex: 1, padding: sp.sm, background: C.warning[50], borderRadius: 6, border: `1px solid ${C.warning[200]}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                              <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />
                              <span style={{ fontSize: '12px', color: C.warning[700] }}><strong>{exploratoryPreview.alertsNew}</strong> new alert emerged</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Remaining Root Causes */}
                        {exploratoryPreview.remainingRootCauses.length > 0 && (
                          <div style={{ marginBottom: sp.md }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[600], marginBottom: sp.xs, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining Root Causes</div>
                            {exploratoryPreview.remainingRootCauses.map(rc => (
                              <div key={rc.id} style={{ display: 'flex', alignItems: 'center', gap: sp.xs, padding: sp.xs, background: 'white', borderRadius: 4, border: `1px solid ${C.neutral[200]}`, marginBottom: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: rc.severity === 'high' ? C.error[500] : rc.severity === 'medium' ? C.warning[500] : C.neutral[400] }} />
                                <span style={{ fontSize: '12px', color: C.neutral[700] }}>{rc.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={() => {
                            setCompletePlanModal({ isOpen: false, planId: null });
                            onViewInsights();
                          }}
                          style={{ width: '100%', padding: sp.sm, fontSize: '13px', fontWeight: 500, background: C.purple[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.xs }}
                        >
                          View Full Analysis
                          <ChevronRight style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div style={{ padding: sp.md, borderTop: `1px solid ${C.neutral[200]}`, background: C.neutral[50], display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setCompletePlanModal({ isOpen: false, planId: null })}
                    style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, background: 'white', color: C.neutral[700], border: `1px solid ${C.neutral[300]}`, borderRadius: 6, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  {!hasIncompleteWork && (
                    <button
                      onClick={() => handleCompletePlan('complete')}
                      style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, background: C.success[500], color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}
                    >
                      <CheckCircle style={{ width: 14, height: 14 }} />
                      Complete Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }
  
  return null;
};

export default PlansTabContent;
