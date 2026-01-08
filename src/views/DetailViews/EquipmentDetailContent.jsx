import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Truck, Wrench, Fuel, Users, MapPin, ChevronRight, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb, Package, Zap } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import { Card, Badge, Progress, Alert, ContributingFactorsModal, ContributingFactorsLink } from '../../components/UI';

const EquipmentDetailContent = ({ equipmentId, activeTab, onNavigateToStaff, onNavigateToZone, onNavigateToEquipment, onNavigateToAlert }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue, endTime, endTimeLabel, useEOD } = useTimeContext();
  
  // Helper to generate equipment data for any ID
  const generateEquipmentData = (id) => {
    // Parse equipment type from ID prefix
    const prefix = id.split('-')[0];
    const typeMap = {
      'FL': { type: 'Sit-Down Forklift', manufacturer: 'Toyota', model: '8FGCU25', isPowered: false },
      'RT': { type: 'Reach Truck', manufacturer: 'Crown', model: 'RR5700', isPowered: true },
      'EPJ': { type: 'Electric Pallet Jack', manufacturer: 'Crown', model: 'PE4500-80', isPowered: true },
      'OP': { type: 'Order Picker', manufacturer: 'Raymond', model: '5400', isPowered: true },
      'TT': { type: 'Tugger/Tow Tractor', manufacturer: 'Toyota', model: '8TB50', isPowered: true }
    };
    const typeInfo = typeMap[prefix] || typeMap['FL'];
    
    // Random status based on some logic
    const statuses = ['Active', 'Active', 'Active', 'Idle', 'Maintenance'];
    const status = statuses[Math.abs(id.charCodeAt(id.length - 1)) % statuses.length];
    
    return {
      id,
      type: typeInfo.type,
      status,
      zone: 'Z01 Inbound',
      zoneId: 'Z01',
      operator: status === 'Active' ? 'Mike Brown' : null,
      battery: typeInfo.isPowered ? 65 + (Math.abs(id.charCodeAt(id.length - 1)) % 30) : null,
      isPowered: typeInfo.isPowered,
      utilization: status === 'Active' ? 72 : status === 'Idle' ? 45 : 0,
      purchaseDate: '2020-06-15',
      manufacturer: typeInfo.manufacturer,
      model: typeInfo.model,
      serialNumber: `${prefix}-${Math.abs(id.charCodeAt(id.length - 1) * 1234)}`,
      hoursSincePM: 280 + (Math.abs(id.charCodeAt(id.length - 1)) % 150),
      pmInterval: 400,
      nextPMDue: '12/28',
      lastPMDate: '2024-10-15',
      hoursToday: status === 'Active' ? 4.5 : 0,
      hoursThisWeek: status === 'Active' ? 28.5 : status === 'Idle' ? 12 : 0,
      hoursThisMonth: 156,
      maintenanceCostYTD: 1850,
      avgCostPerHour: 0.35,
      certifiedOperators: [
        { id: 'E005', name: 'Mike Brown' },
        { id: 'E015', name: 'Carlos Mendez' },
        { id: 'E009', name: 'Kevin Park' }
      ],
      maintenanceHistory: [
        { date: '2024-10-15', type: 'PM', desc: '400-hour service', cost: 320, tech: 'Mike T.', status: 'completed' },
        { date: '2024-08-01', type: 'PM', desc: '400-hour service', cost: 310, tech: 'Sarah L.', status: 'completed' }
      ],
      utilizationHistory: [
        { date: 'Mon', hours: 6.5, target: 7 },
        { date: 'Tue', hours: 6.2, target: 7 },
        { date: 'Wed', hours: 5.8, target: 7 },
        { date: 'Thu', hours: 6.0, target: 7 },
        { date: 'Fri', hours: status === 'Active' ? 4.5 : 0, target: 7 }
      ],
      locationHistory: [
        { time: '06:00', zone: 'Z01 Inbound', zoneId: 'Z01' },
        { time: '08:30', zone: 'Z03 Forward Pick', zoneId: 'Z03' },
        { time: '10:00', zone: 'Z01 Inbound', zoneId: 'Z01' }
      ],
      alerts: status === 'Maintenance' ? [
        { id: `equip-${id}-maint`, sev: 'warning', title: 'In maintenance', msg: 'Scheduled service in progress', time: 'Now', conf: 100 }
      ] : [],
      fleet: { type: typeInfo.type, total: 8, activeCount: 6 },
      relatedEquipment: [
        { id: `${prefix}-01`, status: 'Active' },
        { id: `${prefix}-02`, status: 'Active' },
        { id: `${prefix}-03`, status: 'Idle' }
      ].filter(e => e.id !== id),
      // Default route data
      routeStats: {
        totalDistanceToday: 3.8,
        totalDistanceWeek: 24.2,
        avgTripDistance: 0.16,
        tripsToday: 22,
        tripsThisWeek: 142,
        deadTravelPct: 15,
        avgTripTime: 3.8,
        efficiencyScore: 85
      },
      commonRoutes: [
        { id: 'R1', from: 'Dock Area', fromZone: 'Z01', to: 'Storage', toZone: 'Z04', frequency: 38, avgTime: 3.5, distance: 0.14, activity: 'Putaway' },
        { id: 'R2', from: 'Storage', fromZone: 'Z04', to: 'Dock Area', toZone: 'Z01', frequency: 35, avgTime: 3.0, distance: 0.14, activity: 'Return' },
        { id: 'R3', from: 'Storage', fromZone: 'Z04', to: 'Pick Area', toZone: 'Z03', frequency: 24, avgTime: 4.0, distance: 0.18, activity: 'Replenishment' }
      ],
      stopPoints: [
        { id: 'SP1', location: 'Dock Area', zone: 'Z01 Inbound', zoneId: 'Z01', avgDwell: 2.5, visits: 72, activities: ['Unload', 'Stage'], heatLevel: 'high' },
        { id: 'SP2', location: 'Storage', zone: 'Z04 Bulk', zoneId: 'Z04', avgDwell: 1.8, visits: 58, activities: ['Putaway', 'Retrieval'], heatLevel: 'medium' },
        { id: 'SP3', location: 'Pick Area', zone: 'Z03 Forward', zoneId: 'Z03', avgDwell: 2.0, visits: 28, activities: ['Replenishment'], heatLevel: 'low' }
      ],
      routeAlerts: []
    };
  };

  // Mock equipment data - specific overrides for known equipment
  const specificEquipment = {
    'FL-01': {
      id: 'FL-01', type: 'Sit-Down Forklift', status: 'Active', zone: 'Z04 Bulk Storage', zoneId: 'Z04',
      operator: 'Mike Brown', operatorId: 'E005', battery: null, isPowered: false, utilization: 78,
      purchaseDate: '2020-02-10', manufacturer: 'Toyota', model: '8FGCU25', serialNumber: 'TY8F-31452',
      hoursSincePM: 285, pmInterval: 400, nextPMDue: '12/28', lastPMDate: '2024-11-15',
      hoursToday: 4.2, hoursThisWeek: 28.5, hoursThisMonth: 156,
      maintenanceCostYTD: 1650, avgCostPerHour: 0.32,
      certifiedOperators: [
        { id: 'E005', name: 'Mike Brown' },
        { id: 'E015', name: 'Carlos Mendez' },
        { id: 'E009', name: 'Kevin Park' }
      ],
      maintenanceHistory: [
        { date: '2024-11-15', type: 'PM', desc: '400-hour service', cost: 320, tech: 'Mike T.', status: 'completed' },
        { date: '2024-09-02', type: 'PM', desc: '400-hour service', cost: 310, tech: 'Sarah L.', status: 'completed' },
        { date: '2024-07-18', type: 'Corrective', desc: 'Tire replacement', cost: 420, tech: 'Mike T.', status: 'completed' }
      ],
      // Timeline data for tri-temporal display
      utilizationTimeline: [
        { time: '06:00', actual: 0 },
        { time: '07:00', actual: 0.8 },
        { time: '08:00', actual: 1.9 },
        { time: '09:00', actual: 3.1 },
        { time: '10:00', actual: 4.2, predicted: 4.2, now: true },
        { time: '11:00', predicted: 5.0, upper: 5.3, lower: 4.7 },
        { time: '12:00', predicted: 5.6, upper: 6.0, lower: 5.2 },
        { time: '13:00', predicted: 6.2, upper: 6.7, lower: 5.7 },
        { time: '14:00', predicted: 6.8, upper: 7.4, lower: 6.2 } // EOS Day
      ],
      // Extended timeline for EOD view
      utilizationTimelineEOD: [
        { time: '06:00', actual: 0 },
        { time: '08:00', actual: 1.9 },
        { time: '10:00', actual: 4.2, predicted: 4.2, now: true },
        { time: '12:00', predicted: 5.6, upper: 6.0, lower: 5.2 },
        { time: '14:00', predicted: 6.8, upper: 7.4, lower: 6.2 },
        { time: '16:00', predicted: 8.2, upper: 9.0, lower: 7.4 },
        { time: '18:00', predicted: 10.5, upper: 11.5, lower: 9.5 },
        { time: '20:00', predicted: 12.8, upper: 14.0, lower: 11.6 },
        { time: '22:00', predicted: 14.2, upper: 15.6, lower: 12.8 } // EOD
      ],
      utilizationHistory: [
        { date: 'Mon', hours: 6.8, target: 7 },
        { date: 'Tue', hours: 7.1, target: 7 },
        { date: 'Wed', hours: 6.5, target: 7 },
        { date: 'Thu', hours: 6.9, target: 7 },
        { time: '10:00', date: 'Fri', hours: 4.2, target: 7, isToday: true }
      ],
      // Battery simulation for gas-powered (fuel level)
      fuelLevel: 68,
      fuelTimeline: [
        { time: '06:00', actual: 95 },
        { time: '08:00', actual: 82 },
        { time: '10:00', actual: 68, predicted: 68, now: true },
        { time: '12:00', predicted: 52, upper: 56, lower: 48 },
        { time: '14:00', predicted: 35, upper: 42, lower: 28 } // EOS - needs refuel
      ],
      fuelTimelineEOD: [
        { time: '06:00', actual: 95 },
        { time: '10:00', actual: 68, predicted: 68, now: true },
        { time: '14:00', predicted: 35, upper: 42, lower: 28 },
        { time: '16:00', predicted: 95 }, // Refueled at shift change
        { time: '18:00', predicted: 78 },
        { time: '22:00', predicted: 45 }
      ],
      predictedRefuelTime: '13:45',
      locationHistory: [
        { time: '06:00', zone: 'Z01 Inbound', zoneId: 'Z01' },
        { time: '07:30', zone: 'Z04 Bulk Storage', zoneId: 'Z04' },
        { time: '09:15', zone: 'Z03 Forward Pick', zoneId: 'Z03' },
        { time: '10:00', zone: 'Z04 Bulk Storage', zoneId: 'Z04' }
      ],
      alerts: [],
      // Realistic predictive alerts - issues requiring intervention
      predictiveAlerts: [
        { 
          id: 'fl01-pm', 
          sev: 'warning', 
          title: 'PM threshold approaching', 
          msg: 'Will reach 400-hour PM interval in ~15 operating hours. Schedule maintenance to avoid breakdown risk.', 
          time: '+2 days', 
          conf: 94,
          insightAvailable: true
        },
        { 
          id: 'fl01-efficiency', 
          sev: 'info', 
          title: 'Route efficiency declining', 
          msg: 'Dead travel increased 8% this week vs. baseline. Zone congestion in Z04 may be a factor.', 
          time: 'This week', 
          conf: 78,
          insightAvailable: true
        },
        { 
          id: 'fl01-tire', 
          sev: 'warning', 
          title: 'Tire wear detected', 
          msg: 'Front-right tire showing accelerated wear pattern. Replacement recommended within 50 operating hours.', 
          time: '+1 week', 
          conf: 85,
          insightAvailable: true
        }
      ],
      // Scheduled events - operational, not alerts
      upcomingEvents: [
        { id: 'ev-fuel', type: 'refuel', title: 'Refuel needed', time: '13:45', desc: 'Fuel will drop below 30% at current usage', icon: 'fuel' },
        { id: 'ev-handoff', type: 'handoff', title: 'Operator handoff', time: '14:00', desc: 'Mike Brown → Carlos Mendez', icon: 'users' },
        { id: 'ev-pm', type: 'maintenance', title: 'Scheduled PM', time: 'Dec 28', desc: '400-hour preventive maintenance', icon: 'wrench' }
      ],
      fleet: { type: 'Sit-Down Forklift', total: 8, activeCount: 6 },
      relatedEquipment: [
        { id: 'FL-02', status: 'Active' },
        { id: 'FL-03', status: 'Active' },
        { id: 'FL-06', status: 'Maintenance' },
        { id: 'FL-07', status: 'Idle' }
      ],
      // Performance metrics with predictions
      metrics: {
        assetHealth: { current: 92, predicted: 91, target: 85 },
        mtbf: { current: 186, unit: 'hrs' },
        mttr: { current: 1.8, unit: 'hrs' },
        availability: { current: 97, predicted: 96, target: 95 }
      },
      // Today's stats with predictions and timelines for contextual interpolation
      todayStats: {
        palletsHandled: { 
          current: 142, 
          predicted: 248, 
          target: 220,
          timeline: [
            { time: '06:00', actual: 0 },
            { time: '08:00', actual: 52 },
            { time: '10:00', actual: 142, predicted: 142 },
            { time: '12:00', predicted: 185 },
            { time: '14:00', predicted: 248 }
          ]
        },
        tripsCompleted: { 
          current: 38, 
          predicted: 68, 
          target: 60,
          timeline: [
            { time: '06:00', actual: 0 },
            { time: '08:00', actual: 14 },
            { time: '10:00', actual: 38, predicted: 38 },
            { time: '12:00', predicted: 52 },
            { time: '14:00', predicted: 68 }
          ]
        },
        avgTripTime: { current: 3.8, predicted: 3.6, unit: 'min', target: 4.0 },
        deadTravel: { current: 12, predicted: 14, unit: '%', target: 15 }
      },
      // Route data
      routeStats: {
        totalDistanceToday: 4.8,
        totalDistanceWeek: 32.4,
        avgTripDistance: 0.16,
        tripsToday: 38,
        tripsThisWeek: 186,
        deadTravelPct: 12,
        avgTripTime: 3.8,
        efficiencyScore: 91
      },
      commonRoutes: [
        { id: 'R1', from: 'Dock 1-4', fromZone: 'Z01', to: 'Bulk A1-A12', toZone: 'Z04', frequency: 52, avgTime: 3.6, distance: 0.15, activity: 'Putaway' },
        { id: 'R2', from: 'Bulk A1-A12', fromZone: 'Z04', to: 'Dock 1-4', toZone: 'Z01', frequency: 48, avgTime: 3.0, distance: 0.15, activity: 'Return Empty' },
        { id: 'R3', from: 'Bulk B1-B8', fromZone: 'Z04', to: 'Forward Pick', toZone: 'Z03', frequency: 32, avgTime: 4.2, distance: 0.22, activity: 'Replenishment' }
      ],
      stopPoints: [
        { id: 'SP1', location: 'Dock 1-4', zone: 'Z01', zoneId: 'Z01', avgDwell: 2.5, visits: 96, activities: ['Unload inbound', 'Stage pallets'], heatLevel: 'high' },
        { id: 'SP2', location: 'Bulk Storage A', zone: 'Z04', zoneId: 'Z04', avgDwell: 1.4, visits: 82, activities: ['Putaway', 'Retrieval'], heatLevel: 'high' },
        { id: 'SP3', location: 'Forward Pick', zone: 'Z03', zoneId: 'Z03', avgDwell: 1.9, visits: 38, activities: ['Replenishment'], heatLevel: 'medium' }
      ],
      routeAlerts: []
    },
    'FL-06': {
      id: 'FL-06', type: 'Sit-Down Forklift', status: 'Maintenance', zone: 'Z01 Inbound', zoneId: 'Z01',
      operator: null, battery: null, isPowered: false, utilization: 0,
      purchaseDate: '2019-03-15', manufacturer: 'Toyota', model: '8FGCU25', serialNumber: 'TY8F-29847',
      hoursSincePM: 425, pmInterval: 400, nextPMDue: 'Overdue', lastPMDate: '2024-10-18',
      hoursToday: 0, hoursThisWeek: 18.5, hoursThisMonth: 142,
      maintenanceCostYTD: 2840, avgCostPerHour: 0.42,
      certifiedOperators: [
        { id: 'E005', name: 'Mike Brown' },
        { id: 'E015', name: 'Carlos Mendez' },
        { id: 'E009', name: 'Kevin Park' }
      ],
      maintenanceHistory: [
        { date: '2024-12-17', type: 'Corrective', desc: 'Hydraulic leak repair', cost: 450, tech: 'Mike T.', status: 'in-progress' },
        { date: '2024-10-18', type: 'PM', desc: '400-hour service', cost: 320, tech: 'Mike T.', status: 'completed' },
        { date: '2024-08-05', type: 'PM', desc: '400-hour service', cost: 310, tech: 'Sarah L.', status: 'completed' },
        { date: '2024-06-12', type: 'Corrective', desc: 'Brake adjustment', cost: 180, tech: 'Mike T.', status: 'completed' }
      ],
      utilizationHistory: [
        { date: 'Mon', hours: 6.2, target: 7 },
        { date: 'Tue', hours: 5.8, target: 7 },
        { date: 'Wed', hours: 6.5, target: 7 },
        { date: 'Thu', hours: 5.4, target: 7 },
        { date: 'Fri', hours: 0, target: 7 }
      ],
      locationHistory: [
        { time: '06:00', zone: 'Z01 Inbound', zoneId: 'Z01' },
        { time: '08:30', zone: 'Z04 Bulk Storage', zoneId: 'Z04' },
        { time: '10:00', zone: 'Z01 Inbound', zoneId: 'Z01' }
      ],
      alerts: [
        { id: 'equip-pm-overdue', sev: 'critical', title: 'PM overdue', msg: '25 hours past scheduled maintenance', time: 'Now', conf: 95 }
      ],
      fleet: { type: 'Sit-Down Forklift', total: 8, activeCount: 6 },
      relatedEquipment: [
        { id: 'FL-01', status: 'Active' },
        { id: 'FL-02', status: 'Active' },
        { id: 'FL-03', status: 'Active' },
        { id: 'FL-07', status: 'Idle' },
        { id: 'FL-08', status: 'Maintenance' }
      ],
      // Route data
      routeStats: {
        totalDistanceToday: 4.2, // miles
        totalDistanceWeek: 28.6,
        avgTripDistance: 0.18, // miles per trip
        tripsToday: 24,
        tripsThisWeek: 156,
        deadTravelPct: 18, // percentage of travel without load
        avgTripTime: 4.2, // minutes
        efficiencyScore: 82 // vs optimal
      },
      commonRoutes: [
        { id: 'R1', from: 'Dock 1-4', fromZone: 'Z01', to: 'Bulk A1-A12', toZone: 'Z04', frequency: 45, avgTime: 3.8, distance: 0.15, activity: 'Putaway' },
        { id: 'R2', from: 'Bulk A1-A12', fromZone: 'Z04', to: 'Dock 1-4', toZone: 'Z01', frequency: 42, avgTime: 3.2, distance: 0.15, activity: 'Return Empty' },
        { id: 'R3', from: 'Bulk B1-B8', fromZone: 'Z04', to: 'Forward Pick', toZone: 'Z03', frequency: 28, avgTime: 4.5, distance: 0.22, activity: 'Replenishment' },
        { id: 'R4', from: 'Dock 1-4', fromZone: 'Z01', to: 'Bulk B1-B8', toZone: 'Z04', frequency: 22, avgTime: 4.1, distance: 0.19, activity: 'Putaway' },
        { id: 'R5', from: 'Staging', fromZone: 'Z02', to: 'Dock 5-8', toZone: 'Z02', frequency: 18, avgTime: 2.1, distance: 0.08, activity: 'Loading' }
      ],
      stopPoints: [
        { id: 'SP1', location: 'Dock 1-4', zone: 'Z01', zoneId: 'Z01', avgDwell: 2.8, visits: 87, activities: ['Unload inbound', 'Stage pallets'], heatLevel: 'high' },
        { id: 'SP2', location: 'Bulk Storage A', zone: 'Z04', zoneId: 'Z04', avgDwell: 1.5, visits: 68, activities: ['Putaway', 'Retrieval'], heatLevel: 'high' },
        { id: 'SP3', location: 'Bulk Storage B', zone: 'Z04', zoneId: 'Z04', avgDwell: 1.8, visits: 45, activities: ['Putaway', 'Replenishment'], heatLevel: 'medium' },
        { id: 'SP4', location: 'Forward Pick', zone: 'Z03', zoneId: 'Z03', avgDwell: 2.2, visits: 32, activities: ['Replenishment'], heatLevel: 'medium' },
        { id: 'SP5', location: 'Staging Area', zone: 'Z02', zoneId: 'Z02', avgDwell: 3.1, visits: 24, activities: ['Stage outbound', 'Load trucks'], heatLevel: 'low' },
        { id: 'SP6', location: 'Charging Station', zone: 'Z01', zoneId: 'Z01', avgDwell: 0, visits: 0, activities: ['N/A - Gas powered'], heatLevel: 'none' }
      ],
      routeAlerts: [
        { id: 'route-dead-travel', sev: 'warning', title: 'High dead travel', msg: '18% of trips are empty returns - consider batching', conf: 78 },
        { id: 'route-congestion', sev: 'info', title: 'Congestion pattern', msg: 'Dock 1-4 area busy 06:00-08:00, suggest staggering', conf: 85 }
      ]
    },
    'EPJ-03': {
      id: 'EPJ-03', type: 'Electric Pallet Jack', status: 'Maintenance', zone: 'Z01 Inbound', zoneId: 'Z01',
      operator: null, battery: 45, isPowered: true, utilization: 0,
      purchaseDate: '2021-06-20', manufacturer: 'Crown', model: 'PE4500-80', serialNumber: 'CR-PE-58291',
      hoursSincePM: 510, pmInterval: 500, nextPMDue: '12/14', lastPMDate: '2024-09-28',
      hoursToday: 0, hoursThisWeek: 24.2, hoursThisMonth: 168,
      maintenanceCostYTD: 1240, avgCostPerHour: 0.28,
      certifiedOperators: [
        { id: 'E004', name: 'Sarah Johnson' },
        { id: 'E021', name: 'Nina Patel' },
        { id: 'E022', name: 'Amy Foster' },
        { id: 'E023', name: 'Chris Taylor' }
      ],
      maintenanceHistory: [
        { date: '2024-12-17', type: 'Corrective', desc: 'Lift cylinder repair', cost: 380, tech: 'Sarah L.', status: 'in-progress' },
        { date: '2024-09-28', type: 'PM', desc: '500-hour service', cost: 280, tech: 'Sarah L.', status: 'completed' }
      ],
      utilizationHistory: [
        { date: 'Mon', hours: 6.8, target: 7 },
        { date: 'Tue', hours: 6.5, target: 7 },
        { date: 'Wed', hours: 6.3, target: 7 },
        { date: 'Thu', hours: 4.6, target: 7 },
        { date: 'Fri', hours: 0, target: 7 }
      ],
      locationHistory: [
        { time: '06:00', zone: 'Z03 Forward Pick', zoneId: 'Z03' },
        { time: '09:00', zone: 'Z01 Inbound', zoneId: 'Z01' }
      ],
      alerts: [
        { id: 'equip-epj03-repair', sev: 'warning', title: 'In repair', msg: 'Expected return 14:00 today', time: '+4hr', conf: 85 }
      ],
      fleet: { type: 'Electric Pallet Jack', total: 10, activeCount: 7 },
      relatedEquipment: [
        { id: 'EPJ-01', status: 'Active' },
        { id: 'EPJ-02', status: 'Active' },
        { id: 'EPJ-04', status: 'Active' },
        { id: 'EPJ-05', status: 'Idle' }
      ]
    }
  };
  
  // Get equipment data - use specific if available, otherwise generate
  const equipment = specificEquipment[equipmentId] || generateEquipmentData(equipmentId);
  
  const statusColor = equipment.status === 'Active' ? C.success : equipment.status === 'Idle' ? C.neutral : equipment.status === 'Charging' ? C.brand : equipment.status === 'Maintenance' ? C.warning : C.error;

  // Contributing Factors Modal state
  const [contributingFactorsModal, setContributingFactorsModal] = useState({ isOpen: false, title: '', data: null });
  
  // Contributing Factors data for each metric
  const contributingFactorsData = {
    utilization: {
      whatsHappening: `FL-01 is tracking at ${equipment.hoursToday} hours today, which is 12% above the typical pace for this time of day. Current utilization rate suggests the asset will exceed the 7-hour daily target.`,
      whyImportant: 'Higher-than-expected utilization increases wear patterns and may accelerate the PM schedule. However, it also indicates strong productivity and efficient asset deployment.',
      contributors: [
        { label: 'Operator Performance', weight: 42, direction: 'up', detail: 'Mike Brown averaging 8% faster cycle times', onClick: () => {} },
        { label: 'Route Assignments', weight: 35, direction: 'up', detail: 'High-frequency dock-to-storage routes today', onClick: () => {} },
        { label: 'Zone Congestion', weight: 23, direction: 'neutral', detail: 'Z04 traffic normal for this shift', onClick: () => {} }
      ],
      calculation: {
        formula: 'Utilization = (Actual Operating Hours / Scheduled Hours) × 100',
        dataSources: ['Telematics GPS', 'Ignition sensor', 'Operator login events'],
        refreshRate: 'Real-time',
        confidence: 98
      },
      actions: [
        { label: 'View Operators', onClick: () => {} },
        { label: 'View Routes', onClick: () => {} }
      ]
    },
    fuelLevel: {
      whatsHappening: `Fuel level is at ${equipment.fuelLevel}% and depleting at 8.2%/hour. At current consumption, refueling will be required by 13:45 to avoid dropping below the 30% safety threshold.`,
      whyImportant: 'Running below 30% increases risk of fuel starvation during operations and can damage the fuel pump. Scheduling a refuel during the next natural break prevents unplanned downtime.',
      contributors: [
        { label: 'Operating Intensity', weight: 55, direction: 'up', detail: 'Heavy lifting increases consumption 12%', onClick: () => {} },
        { label: 'Route Distance', weight: 30, direction: 'neutral', detail: 'Average trip distance today: 0.16 mi', onClick: () => {} },
        { label: 'Idle Time', weight: 15, direction: 'down', detail: 'Low idle time reducing waste', onClick: () => {} }
      ],
      calculation: {
        formula: 'Depletion Rate = (Start Level - Current Level) / Operating Hours',
        dataSources: ['Fuel tank sensor', 'Engine run time', 'Historical consumption'],
        refreshRate: 'Every 5 minutes',
        confidence: 82
      },
      actions: [
        { label: 'View Maintenance', onClick: () => {} },
        { label: 'Schedule Refuel', onClick: () => {} }
      ]
    },
    assetHealth: {
      whatsHappening: 'Asset Health score is 92%, indicating excellent overall condition. The score has remained stable over the past 30 days with minor fluctuation due to approaching PM interval.',
      whyImportant: 'Maintaining Asset Health above 85% correlates with 40% fewer unplanned breakdowns. Current trajectory suggests the score may dip to 91% by end of shift as PM hours accumulate.',
      contributors: [
        { label: 'PM Compliance', weight: 40, direction: 'neutral', detail: '285 of 400 hours to next PM', onClick: () => {} },
        { label: 'Fault History', weight: 35, direction: 'up', detail: 'No faults in past 30 days', onClick: () => {} },
        { label: 'Sensor Readings', weight: 25, direction: 'neutral', detail: 'All telemetry within normal range', onClick: () => {} }
      ],
      calculation: {
        formula: 'Health = (0.4 × PM Score) + (0.35 × Fault Score) + (0.25 × Sensor Score)',
        dataSources: ['PM logs', 'Fault code history', 'IoT sensor telemetry'],
        refreshRate: 'Every 15 minutes',
        confidence: 94
      },
      actions: [
        { label: 'View Maintenance History', onClick: () => {} },
        { label: 'View Sensor Data', onClick: () => {} }
      ]
    },
    palletsHandled: {
      whatsHappening: 'FL-01 has handled 142 pallets so far today, on pace to reach 248 by end of shift. This exceeds the 220-pallet target by 13%.',
      whyImportant: 'Strong pallet throughput indicates effective deployment. Exceeding targets while maintaining efficiency scores suggests optimal operator-equipment pairing.',
      contributors: [
        { label: 'Operator Skill', weight: 45, direction: 'up', detail: 'Mike Brown: 95th percentile speed', onClick: () => {} },
        { label: 'Zone Assignment', weight: 35, direction: 'up', detail: 'High-volume Z04 bulk storage', onClick: () => {} },
        { label: 'Pallet Type Mix', weight: 20, direction: 'neutral', detail: '80% standard pallets today', onClick: () => {} }
      ],
      calculation: {
        formula: 'Count of completed pallet movements logged via scan events',
        dataSources: ['Barcode scans', 'WMS transactions', 'Location sensors'],
        refreshRate: 'Real-time',
        confidence: 99
      },
      actions: [
        { label: 'View Operator Stats', onClick: () => {} },
        { label: 'View Zone Activity', onClick: () => {} }
      ]
    },
    tripsCompleted: {
      whatsHappening: '38 trips completed today with an average trip time of 3.8 minutes. Projected to reach 68 trips by end of shift.',
      whyImportant: 'Trip count combined with efficiency score indicates productive asset utilization. Current dead travel of 12% is below the 15% threshold.',
      contributors: [
        { label: 'Route Efficiency', weight: 50, direction: 'up', detail: 'Optimized dock-to-storage paths', onClick: () => {} },
        { label: 'Zone Proximity', weight: 30, direction: 'neutral', detail: 'Working adjacent zones today', onClick: () => {} },
        { label: 'Load/Unload Speed', weight: 20, direction: 'up', detail: 'Fast staging at docks', onClick: () => {} }
      ],
      calculation: {
        formula: 'Trip = Start location → Load → Destination → Unload confirmation',
        dataSources: ['GPS waypoints', 'Load sensors', 'Scan events'],
        refreshRate: 'Real-time',
        confidence: 97
      },
      actions: [
        { label: 'View Routes', onClick: () => {} },
        { label: 'View Zone Map', onClick: () => {} }
      ]
    },
    efficiencyScore: {
      whatsHappening: 'Efficiency score is 91%, indicating excellent performance. This factors in dead travel, trip times, and route optimization.',
      whyImportant: 'Efficiency above 85% indicates optimal asset deployment. Current score is 6 points above fleet average for sit-down forklifts.',
      contributors: [
        { label: 'Dead Travel', weight: 40, direction: 'up', detail: 'Only 12% empty trips vs 15% target', onClick: () => {} },
        { label: 'Trip Time', weight: 35, direction: 'up', detail: '3.8 min avg vs 4.2 min baseline', onClick: () => {} },
        { label: 'Route Selection', weight: 25, direction: 'neutral', detail: 'Using recommended paths', onClick: () => {} }
      ],
      calculation: {
        formula: 'Efficiency = 100 - (Dead Travel Penalty) - (Time Penalty) + (Route Bonus)',
        dataSources: ['GPS tracks', 'Route recommendations', 'Historical baselines'],
        refreshRate: 'Hourly',
        confidence: 88
      },
      actions: [
        { label: 'View Route Analysis', onClick: () => {} },
        { label: 'Compare to Fleet', onClick: () => {} }
      ]
    }
  };

  return (
    <>
      {/* Contributing Factors Modal */}
      <ContributingFactorsModal 
        isOpen={contributingFactorsModal.isOpen}
        onClose={() => setContributingFactorsModal({ isOpen: false, title: '', data: null })}
        title={contributingFactorsModal.title}
        data={contributingFactorsModal.data}
      />
      
      {/* Dashboard Tab - includes Hero Card */}
      {activeTab === 'dashboard' && (
        <>
          {/* Consolidated Hero Card - Equipment Identity + Performance Metrics */}
          <Card style={{ borderLeft: `4px solid ${statusColor[500]}` }}>
            {/* Top Section - Equipment Identity */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: sp.md, marginBottom: sp.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: 12, 
                  background: statusColor[50], 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Truck style={{ width: 28, height: 28, color: statusColor[600] }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 500, margin: 0, color: C.neutral[900] }}>{equipment.id} — {equipment.type}</h2>
                    <Badge status={equipment.status === 'Active' ? 'success' : equipment.status === 'Maintenance' ? 'warning' : equipment.status === 'Offline' ? 'error' : 'neutral'} label={equipment.status} dot={equipment.status === 'Active'} />
                  </div>
                  <p style={{ fontSize: '14px', color: C.neutral[600], margin: 0, marginTop: 4 }}>{equipment.manufacturer} {equipment.model} • {equipment.zone}</p>
                  {/* Current Operator - with chevron for navigation */}
                  {equipment.operator && (
                    <div 
                      onClick={() => onNavigateToStaff && equipment.certifiedOperators?.[0] && onNavigateToStaff(equipment.certifiedOperators[0].id, equipment.certifiedOperators[0].name)}
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: sp.xs, 
                        marginTop: sp.sm, padding: '4px 6px 4px 10px',
                        background: C.purple[50], borderRadius: 16,
                        cursor: 'pointer',
                        border: `1px solid ${C.purple[200]}`,
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.background = C.purple[100]; 
                        e.currentTarget.style.borderColor = C.purple[300];
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.background = C.purple[50]; 
                        e.currentTarget.style.borderColor = C.purple[200];
                      }}
                    >
                      <Users style={{ width: 14, height: 14, color: C.purple[600] }} />
                      <span style={{ fontSize: '12px', color: C.purple[700], fontWeight: 500 }}>
                        {equipment.operator}
                      </span>
                      <span style={{ fontSize: '11px', color: C.purple[500] }}>operating</span>
                      <ChevronRight style={{ width: 14, height: 14, color: C.purple[400] }} />
                    </div>
                  )}
                </div>
              </div>
              {/* Utilization with tri-temporal including contextual */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: 4 }}>Utilization Today</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '28px', fontWeight: 300, color: C.neutral[800] }}>{equipment.hoursToday}</span>
                  <span style={{ fontSize: '14px', color: C.neutral[500] }}>hrs</span>
                  {equipment.utilizationTimeline && (
                    <>
                      {/* Contextual time value - only show if different from NOW */}
                      {isContextualDifferent && contextualTime !== '10:00' && (
                        <>
                          <ArrowRight style={{ width: 12, height: 12, color: C.neutral[400], marginLeft: 4 }} />
                          <span style={{ 
                            fontSize: '16px', 
                            fontWeight: 500, 
                            color: C.brand[700],
                            padding: '2px 6px',
                            background: C.brand[100],
                            borderRadius: 4
                          }}>
                            {interpolateValue(useEOD ? equipment.utilizationTimelineEOD : equipment.utilizationTimeline, contextualTime)?.toFixed(1) || '—'}
                          </span>
                          <span style={{ fontSize: '10px', color: C.brand[600] }}>@{contextualTime}</span>
                        </>
                      )}
                      {/* End time prediction */}
                      <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400], marginLeft: 4 }} />
                      <span style={{ fontSize: '18px', fontWeight: 500, color: C.purple[600] }}>
                        {useEOD ? '14.2' : '6.8'}
                      </span>
                      <span style={{ fontSize: '11px', color: C.purple[500] }}>@{endTimeLabel}</span>
                    </>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: C.neutral[400] }}>Target: 7 hrs/shift</p>
              </div>
            </div>
            
            {/* Divider */}
            <div style={{ borderTop: `1px solid ${C.neutral[200]}`, marginBottom: sp.md }} />
            
            {/* Performance Metrics + Health Indicators - 6 metrics in 3x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm }}>
              {[
                { 
                  label: 'Asset Health', 
                  value: equipment.metrics?.assetHealth?.current || 92, 
                  pred: equipment.metrics?.assetHealth?.predicted || 91,
                  target: 85,
                  unit: '%', 
                  desc: 'Composite score',
                  getColor: (v) => v >= 90 ? C.success : v >= 75 ? C.warning : C.error,
                  hasContextual: true,
                  factorsKey: 'assetHealth'
                },
                { 
                  label: 'Availability', 
                  value: equipment.metrics?.availability?.current || 97, 
                  pred: equipment.metrics?.availability?.predicted || 96,
                  target: 95,
                  unit: '%', 
                  desc: 'Uptime rate',
                  getColor: (v) => v >= 95 ? C.success : v >= 85 ? C.warning : C.error,
                  hasContextual: true,
                  factorsKey: 'assetHealth'
                },
                { 
                  label: 'Breakdown Risk', 
                  value: equipment.hoursSincePM > equipment.pmInterval ? 'High' : 'Low',
                  isRisk: true,
                  desc: 'Next 7 days',
                  getColor: () => equipment.hoursSincePM > equipment.pmInterval ? C.error : C.success,
                  factorsKey: 'assetHealth'
                },
                { 
                  label: 'MTBF', 
                  value: equipment.metrics?.mtbf?.current || 186, 
                  unit: 'hrs', 
                  desc: 'Mean time between failures',
                  getColor: () => C.brand,
                  factorsKey: 'assetHealth'
                },
                { 
                  label: 'MTTR', 
                  value: equipment.metrics?.mttr?.current || 1.8, 
                  unit: 'hrs', 
                  desc: 'Mean time to repair',
                  getColor: (v) => v <= 2 ? C.success : v <= 4 ? C.warning : C.error,
                  factorsKey: 'assetHealth'
                },
                { 
                  label: 'Cost vs Fleet', 
                  value: '-8%',
                  isComparison: true,
                  desc: 'Maintenance YTD',
                  getColor: () => C.success, // Below average is good
                  factorsKey: 'assetHealth'
                }
              ].map((m, i) => {
                const color = m.getColor(m.value);
                // Calculate contextual value (interpolate between current and predicted based on time)
                const contextualVal = isContextualDifferent && contextualTime !== '10:00' && m.hasContextual && m.pred
                  ? Math.round(m.value + ((m.pred - m.value) * 0.5)) // Simplified interpolation
                  : null;
                return (
                  <div 
                    key={i} 
                    style={{ 
                      padding: sp.sm, 
                      background: color[50], 
                      borderRadius: 6, 
                      textAlign: 'center',
                      borderTop: `3px solid ${color[500]}`
                    }}
                  >
                    <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{m.label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: m.isRisk || m.isComparison ? '18px' : '20px', fontWeight: 500, color: color[600] }}>
                        {m.value}
                      </span>
                      {m.unit && <span style={{ fontSize: '11px', color: C.neutral[500] }}>{m.unit}</span>}
                      {/* Contextual value */}
                      {contextualVal !== null && (
                        <>
                          <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            color: C.brand[700],
                            padding: '1px 4px',
                            background: C.brand[100],
                            borderRadius: 3
                          }}>
                            {contextualVal}
                          </span>
                        </>
                      )}
                      {/* Predicted value */}
                      {m.pred && (
                        <>
                          <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                          <span style={{ fontSize: '12px', color: C.purple[600] }}>{m.pred}</span>
                        </>
                      )}
                    </div>
                    <p style={{ fontSize: '9px', color: C.neutral[400] }}>{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Utilization Timeline - Line Chart with Tri-Temporal */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Utilization Timeline</h3>
                  <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                    isOpen: true, 
                    title: 'Utilization', 
                    data: contributingFactorsData.utilization 
                  })} />
                </div>
                <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>
                  Hours worked today • Target: 7 hrs by {useEOD ? 'EOD' : 'EOS'}
                </p>
              </div>
              {isContextualDifferent && contextualTime !== '10:00' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: '4px 10px', background: C.brand[100], borderRadius: 6 }}>
                  <span style={{ fontSize: '12px', color: C.brand[600] }}>
                    @{contextualTime}: <strong>{interpolateValue(useEOD ? equipment.utilizationTimelineEOD : equipment.utilizationTimeline, contextualTime)?.toFixed(1) || '—'}</strong> hrs
                  </span>
                </div>
              )}
            </div>
            {/* Line chart with contextual marker */}
            <div style={{ position: 'relative', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={useEOD ? equipment.utilizationTimelineEOD : equipment.utilizationTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="utilActualFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.brand[500]} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.brand[500]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="utilPredFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.purple[500]} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.purple[500]} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={{ stroke: C.neutral[200] }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={25} domain={[0, 'auto']} />
                  {/* Target line */}
                  <Area type="linear" dataKey={() => 7} stroke={C.success[400]} strokeWidth={1} strokeDasharray="4 4" fill="none" />
                  {/* Confidence band */}
                  <Area type="linear" dataKey="upper" stroke="none" fill="url(#utilPredFill)" />
                  <Area type="linear" dataKey="lower" stroke="none" fill="url(#utilPredFill)" />
                  {/* Actual line */}
                  <Area type="linear" dataKey="actual" stroke={C.brand[500]} strokeWidth={2} fill="url(#utilActualFill)" dot={false} connectNulls />
                  {/* Predicted line */}
                  <Area type="linear" dataKey="predicted" stroke={C.purple[500]} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
              {/* NOW marker label overlay */}
              {(() => {
                const timeline = useEOD ? equipment.utilizationTimelineEOD : equipment.utilizationTimeline;
                const times = timeline.map(d => {
                  const [h, m] = d.time.split(':').map(Number);
                  return h + (m || 0) / 60;
                });
                const minTime = Math.min(...times);
                const maxTime = Math.max(...times);
                const nowDecimal = 10; // 10:00
                const nowPosition = ((nowDecimal - minTime) / (maxTime - minTime)) * 100;
                return (
                  <div style={{ 
                    position: 'absolute', 
                    top: 10, 
                    bottom: 25, 
                    left: `calc(${nowPosition}% * 0.85 + 25px)`,
                    width: 2, 
                    background: C.neutral[600], 
                    zIndex: 9,
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      position: 'absolute', 
                      top: -8, 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: C.neutral[600], 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: 3, 
                      fontSize: 9, 
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      NOW
                    </div>
                  </div>
                );
              })()}
              {/* Contextual time marker overlay - only if different from NOW */}
              {isContextualDifferent && contextualTime !== '10:00' && (() => {
                const timeline = useEOD ? equipment.utilizationTimelineEOD : equipment.utilizationTimeline;
                const times = timeline.map(d => {
                  const [h, m] = d.time.split(':').map(Number);
                  return h + (m || 0) / 60;
                });
                const [ctxH, ctxM] = contextualTime.split(':').map(Number);
                const ctxDecimal = ctxH + (ctxM || 0) / 60;
                const minTime = Math.min(...times);
                const maxTime = Math.max(...times);
                if (ctxDecimal < minTime || ctxDecimal > maxTime) return null;
                const position = ((ctxDecimal - minTime) / (maxTime - minTime)) * 100;
                return (
                  <div style={{ 
                    position: 'absolute', 
                    top: 10, 
                    bottom: 25, 
                    left: `calc(${position}% * 0.85 + 25px)`,
                    width: 2, 
                    background: C.brand[500], 
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: -8, 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: C.brand[500], 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: 3, 
                      fontSize: 9, 
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {contextualTime}
                    </div>
                  </div>
                );
              })()}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: sp.lg, paddingTop: sp.sm, borderTop: `1px solid ${C.neutral[100]}`, marginTop: sp.sm }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 3, background: C.brand[500], borderRadius: 2 }} />
                Actual
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 0, borderTop: `2px dashed ${C.purple[500]}` }} />
                Predicted
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 0, borderTop: `2px dashed ${C.success[400]}` }} />
                Target (7h)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 3, background: C.neutral[600], borderRadius: 2 }} />
                Now
              </span>
              {isContextualDifferent && contextualTime !== '10:00' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.brand[600] }}>
                  <span style={{ width: 16, height: 3, background: C.brand[500], borderRadius: 2 }} />
                  @{contextualTime}
                </span>
              )}
            </div>
          </Card>
          
          {/* Today's Stats - 2 column layout, compact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.sm }}>
            {[
              { 
                label: 'Pallets Handled', 
                value: equipment.todayStats?.palletsHandled?.current || 142, 
                pred: equipment.todayStats?.palletsHandled?.predicted || 248,
                target: equipment.todayStats?.palletsHandled?.target || 220, 
                timeline: equipment.todayStats?.palletsHandled?.timeline,
                icon: Package,
                good: (equipment.todayStats?.palletsHandled?.predicted || 248) >= (equipment.todayStats?.palletsHandled?.target || 220)
              },
              { 
                label: 'Trips Completed', 
                value: equipment.todayStats?.tripsCompleted?.current || 38, 
                pred: equipment.todayStats?.tripsCompleted?.predicted || 68,
                target: equipment.todayStats?.tripsCompleted?.target || 60, 
                timeline: equipment.todayStats?.tripsCompleted?.timeline,
                icon: TrendingUp,
                good: (equipment.todayStats?.tripsCompleted?.predicted || 68) >= (equipment.todayStats?.tripsCompleted?.target || 60)
              },
              { 
                label: 'Hours Since PM', 
                value: equipment.hoursSincePM, 
                target: equipment.pmInterval, 
                warn: equipment.hoursSincePM > equipment.pmInterval * 0.9, 
                icon: Wrench,
                inlineTarget: true
              },
              { 
                label: 'Efficiency Score', 
                value: equipment.routeStats?.efficiencyScore || 91, 
                unit: '%',
                icon: Zap,
                good: (equipment.routeStats?.efficiencyScore || 91) >= 85
              }
            ].map((metric, i) => {
              const contextualVal = isContextualDifferent && contextualTime !== '10:00' && metric.timeline 
                ? Math.round(interpolateValue(metric.timeline, contextualTime)) 
                : null;
              return (
                <Card key={i} style={{ padding: sp.sm, borderLeft: `3px solid ${metric.warn ? C.warning[500] : metric.good ? C.success[500] : C.neutral[300]}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: 6, 
                      background: metric.warn ? C.warning[50] : metric.good ? C.success[50] : C.neutral[50],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <metric.icon style={{ width: 16, height: 16, color: metric.warn ? C.warning[600] : metric.good ? C.success[600] : C.neutral[500] }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0, marginBottom: 2 }}>{metric.label}</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '20px', fontWeight: 500, color: metric.warn ? C.warning[700] : C.neutral[800] }}>
                          {metric.value}{metric.unit || ''}
                        </span>
                        {/* Inline target for Hours Since PM */}
                        {metric.inlineTarget && metric.target && (
                          <span style={{ fontSize: '12px', color: C.neutral[400] }}>/ {metric.target}</span>
                        )}
                        {/* Contextual value */}
                        {contextualVal !== null && (
                          <>
                            <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: 500, 
                              color: C.brand[700],
                              padding: '1px 6px',
                              background: C.brand[100],
                              borderRadius: 3
                            }}>
                              {contextualVal}
                            </span>
                          </>
                        )}
                        {/* Predicted value */}
                        {metric.pred && (
                          <>
                            <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                            <span style={{ fontSize: '14px', fontWeight: 500, color: C.purple[600] }}>{metric.pred}</span>
                          </>
                        )}
                        {/* Target badge for metrics with predictions */}
                        {metric.target && metric.pred && (
                          <span style={{ 
                            fontSize: '10px', 
                            color: metric.good ? C.success[600] : C.warning[600],
                            marginLeft: 2
                          }}>
                            ({metric.good ? '✓' : '!'} {metric.target})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Fuel/Battery Prediction Card */}
          <Card style={{ background: `linear-gradient(135deg, ${C.warning[50]} 0%, ${C.neutral[50]} 100%)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Fuel style={{ width: 16, height: 16, color: C.warning[600] }} />
                    Fuel Level Prediction
                  </h3>
                  <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                    isOpen: true, 
                    title: 'Fuel Level', 
                    data: contributingFactorsData.fuelLevel 
                  })} />
                </div>
                <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>
                  Estimated refuel needed at {equipment.predictedRefuelTime || '13:45'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                {isContextualDifferent && contextualTime !== '10:00' && (
                  <div style={{ padding: '4px 8px', background: C.brand[100], borderRadius: 4 }}>
                    <span style={{ fontSize: '11px', color: C.brand[700] }}>
                      @{contextualTime}: <strong>{Math.round(interpolateValue(useEOD ? equipment.fuelTimelineEOD : equipment.fuelTimeline, contextualTime) || 0)}%</strong>
                    </span>
                  </div>
                )}
                <Badge status="warning" label="Refuel by 13:45" />
              </div>
            </div>
            
            {/* Fuel timeline mini-chart with NOW and contextual markers */}
            <div style={{ position: 'relative', height: 100, marginBottom: sp.sm }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={useEOD ? equipment.fuelTimelineEOD : equipment.fuelTimeline} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.warning[500]} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.warning[500]} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: C.neutral[500] }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={25} domain={[0, 100]} />
                  {/* Warning threshold */}
                  <Area type="linear" dataKey={() => 30} stroke={C.error[300]} strokeWidth={1} strokeDasharray="3 3" fill="none" />
                  {/* Actual + predicted */}
                  <Area type="linear" dataKey="actual" stroke={C.warning[500]} strokeWidth={2} fill="url(#fuelGradient)" dot={false} connectNulls />
                  <Area type="linear" dataKey="predicted" stroke={C.warning[500]} strokeWidth={2} strokeDasharray="4 3" fill="url(#fuelGradient)" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
              {/* NOW marker label overlay */}
              {(() => {
                const timeline = useEOD ? equipment.fuelTimelineEOD : equipment.fuelTimeline;
                const times = timeline.map(d => {
                  const [h, m] = d.time.split(':').map(Number);
                  return h + (m || 0) / 60;
                });
                const minTime = Math.min(...times);
                const maxTime = Math.max(...times);
                const nowDecimal = 10; // 10:00
                const nowPosition = ((nowDecimal - minTime) / (maxTime - minTime)) * 100;
                return (
                  <div style={{ 
                    position: 'absolute', 
                    top: 5, 
                    bottom: 20, 
                    left: `calc(${nowPosition}% * 0.88 + 25px)`,
                    width: 2, 
                    background: C.neutral[600], 
                    zIndex: 9,
                    pointerEvents: 'none'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: -6, 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: C.neutral[600], 
                      color: 'white', 
                      padding: '1px 4px', 
                      borderRadius: 2, 
                      fontSize: 8, 
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      NOW
                    </div>
                  </div>
                );
              })()}
              {/* Contextual time marker overlay - only if different from NOW */}
              {isContextualDifferent && contextualTime !== '10:00' && (() => {
                const timeline = useEOD ? equipment.fuelTimelineEOD : equipment.fuelTimeline;
                const times = timeline.map(d => {
                  const [h, m] = d.time.split(':').map(Number);
                  return h + (m || 0) / 60;
                });
                const [ctxH, ctxM] = contextualTime.split(':').map(Number);
                const ctxDecimal = ctxH + (ctxM || 0) / 60;
                const minTime = Math.min(...times);
                const maxTime = Math.max(...times);
                if (ctxDecimal < minTime || ctxDecimal > maxTime) return null;
                const position = ((ctxDecimal - minTime) / (maxTime - minTime)) * 100;
                return (
                  <div style={{ 
                    position: 'absolute', 
                    top: 5, 
                    bottom: 20, 
                    left: `calc(${position}% * 0.88 + 25px)`,
                    width: 2, 
                    background: C.brand[500], 
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: -6, 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: C.brand[500], 
                      color: 'white', 
                      padding: '1px 4px', 
                      borderRadius: 2, 
                      fontSize: 8, 
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {contextualTime}
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Current stats row with contextual value */}
            <div style={{ display: 'flex', gap: sp.md }}>
              <div style={{ flex: 1, padding: sp.sm, background: 'rgba(255,255,255,0.7)', borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0 }}>Fuel Level</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: C.warning[700] }}>{equipment.fuelLevel || 68}%</span>
                  {/* Contextual value - only show if different from NOW */}
                  {isContextualDifferent && contextualTime !== '10:00' && (
                    <>
                      <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        color: C.brand[700],
                        padding: '1px 5px',
                        background: C.brand[100],
                        borderRadius: 3
                      }}>
                        {Math.round(interpolateValue(useEOD ? equipment.fuelTimelineEOD : equipment.fuelTimeline, contextualTime) || 0)}%
                      </span>
                      <span style={{ fontSize: '9px', color: C.brand[600] }}>@{contextualTime}</span>
                    </>
                  )}
                  {/* End time prediction */}
                  <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                  <span style={{ fontSize: '14px', color: C.purple[600] }}>{useEOD ? '45' : '35'}%</span>
                  <span style={{ fontSize: '10px', color: C.purple[500] }}>@{endTimeLabel}</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: sp.sm, background: 'rgba(255,255,255,0.7)', borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0 }}>Est. Runtime Left</p>
                <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>~3.5 hrs</p>
              </div>
              <div style={{ flex: 1, padding: sp.sm, background: 'rgba(255,255,255,0.7)', borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0 }}>Consumption Rate</p>
                <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>8.2%/hr</p>
              </div>
            </div>
          </Card>
          
          {/* Upcoming Events - Scheduled operational items */}
          {equipment.upcomingEvents && equipment.upcomingEvents.length > 0 && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Calendar style={{ width: 16, height: 16, color: C.neutral[500] }} />
                    Upcoming Events
                  </h3>
                  <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>Scheduled operational activities</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {equipment.upcomingEvents.map((event, i) => {
                  const iconMap = {
                    fuel: Fuel,
                    users: Users,
                    wrench: Wrench
                  };
                  const EventIcon = iconMap[event.icon] || Clock;
                  const colorMap = {
                    refuel: C.warning,
                    handoff: C.purple,
                    maintenance: C.brand
                  };
                  const color = colorMap[event.type] || C.neutral;
                  
                  return (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: sp.md,
                      padding: sp.sm,
                      background: C.neutral[50],
                      borderRadius: 6,
                      borderLeft: `3px solid ${color[400]}`
                    }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 6,
                        background: color[100],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <EventIcon style={{ width: 16, height: 16, color: color[600] }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: C.neutral[800] }}>{event.title}</p>
                        <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>{event.desc}</p>
                      </div>
                      <div style={{ 
                        padding: '4px 8px', 
                        background: color[100], 
                        borderRadius: 4,
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: color[700] }}>{event.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
          
          {/* Analysis - with CTA to Insights tab */}
          {equipment.predictiveAlerts && equipment.predictiveAlerts.length > 0 && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Analysis</h3>
                  <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>Issues that may impact productivity</p>
                </div>
                <div 
                  onClick={() => {/* Navigate to Insights tab - would need prop */}}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: sp.xs,
                    padding: '6px 12px',
                    background: C.purple[50],
                    borderRadius: 6,
                    cursor: 'pointer',
                    border: `1px solid ${C.purple[200]}`
                  }}
                >
                  <Lightbulb style={{ width: 14, height: 14, color: C.purple[600] }} />
                  <span style={{ fontSize: '12px', color: C.purple[700], fontWeight: 500 }}>View AI Recommendations</span>
                  <ChevronRight style={{ width: 14, height: 14, color: C.purple[500] }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {equipment.predictiveAlerts.map((alert, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: sp.sm,
                    background: alert.sev === 'warning' ? C.warning[50] : alert.sev === 'critical' ? C.error[50] : C.brand[50],
                    borderRadius: 6,
                    borderLeft: `3px solid ${alert.sev === 'warning' ? C.warning[500] : alert.sev === 'critical' ? C.error[500] : C.brand[500]}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <AlertTriangle style={{ 
                        width: 16, height: 16, 
                        color: alert.sev === 'warning' ? C.warning[600] : alert.sev === 'critical' ? C.error[600] : C.brand[600] 
                      }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{alert.title}</p>
                        <p style={{ fontSize: '11px', color: C.neutral[600], margin: 0 }}>{alert.msg}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[700], margin: 0 }}>{alert.time}</p>
                        <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0 }}>{alert.conf}% confidence</p>
                      </div>
                      <div 
                        style={{ 
                          padding: '4px 8px', 
                          background: C.purple[100], 
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                        title="Explore solutions in Insights tab"
                      >
                        <Lightbulb style={{ width: 14, height: 14, color: C.purple[600] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Active Alerts (existing) */}
          {equipment.alerts && equipment.alerts.length > 0 && (
            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Active Alerts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {equipment.alerts.map((alert, i) => (
                  <Alert 
                    key={i} 
                    {...alert} 
                    onClick={() => onNavigateToAlert && onNavigateToAlert(alert.id, 'equipment', true)}
                  />
                ))}
              </div>
            </Card>
          )}
        </>
      )}
      
      {/* Operators Tab */}
      {activeTab === 'operators' && (
        <>
          {/* Current Operator Card */}
          <Card style={{ borderLeft: `4px solid ${C.purple[500]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', 
                  background: C.purple[100], 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `3px solid ${C.purple[500]}`
                }}>
                  <Users style={{ width: 24, height: 24, color: C.purple[600] }} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: 2 }}>CURRENTLY OPERATING</p>
                  <p 
                    onClick={() => onNavigateToStaff && equipment.certifiedOperators?.[0] && onNavigateToStaff(equipment.certifiedOperators[0].id, equipment.certifiedOperators[0].name)}
                    style={{ fontSize: '18px', fontWeight: 500, color: C.purple[700], cursor: 'pointer' }}
                  >
                    {equipment.certifiedOperators?.[0]?.name || 'Unassigned'}
                  </p>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>Since 6:02 AM • 5.2 hrs today</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: sp.md }}>
                <div style={{ textAlign: 'center', padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                  <p style={{ fontSize: '18px', fontWeight: 500, color: C.success[600] }}>89</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Driver Score</p>
                </div>
                <div style={{ textAlign: 'center', padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                  <p style={{ fontSize: '18px', fontWeight: 500 }}>42</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Pallets/hr</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Operator Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Certified Ops', value: equipment.certifiedOperators?.length || 0, sub: 'For this unit' },
              { label: 'Avg Driver Score', value: 87, unit: '%', sub: 'Safety & efficiency', good: true },
              { label: 'Impact Events', value: 2, sub: 'Last 30 days', warn: true },
              { label: 'Expiring Certs', value: 1, sub: 'Next 30 days', warn: true }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>
                  {s.value}{s.unit && <span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Certified Operators List */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>All Certified Operators</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {(equipment.certifiedOperators || []).map((op, i) => {
                const score = 75 + Math.floor(Math.random() * 20);
                const hoursOnUnit = 120 + Math.floor(Math.random() * 200);
                const certExpiry = ['2025-03-15', '2025-06-22', '2025-08-10', '2025-01-30'][i % 4];
                const impactEvents = i === 0 ? 2 : 0;
                const isExpiringSoon = new Date(certExpiry) < new Date(Date.now() + 30*24*60*60*1000);
                const isCurrent = i === 0;
                
                return (
                  <div 
                    key={i} 
                    onClick={() => onNavigateToStaff && onNavigateToStaff(op.id, op.name)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: sp.md,
                      background: isCurrent ? C.purple[50] : 'white',
                      border: `1px solid ${isCurrent ? C.purple[200] : C.neutral[200]}`,
                      borderLeft: `4px solid ${isCurrent ? C.purple[500] : score >= 85 ? C.success[500] : score >= 70 ? C.warning[500] : C.error[500]}`,
                      borderRadius: '0 8px 8px 0',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Avatar with score ring */}
                    <div style={{ position: 'relative', marginRight: sp.md }}>
                      <div style={{ 
                        width: 44, height: 44, borderRadius: '50%', 
                        background: C.purple[100], 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `3px solid ${score >= 85 ? C.success[500] : score >= 70 ? C.warning[500] : C.error[500]}`
                      }}>
                        <Users style={{ width: 20, height: 20, color: C.purple[600] }} />
                      </div>
                      {/* Score badge */}
                      <div style={{ 
                        position: 'absolute', bottom: -4, right: -4, 
                        width: 22, height: 22, borderRadius: '50%',
                        background: score >= 85 ? C.success[500] : score >= 70 ? C.warning[500] : C.error[500],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', fontWeight: 700, color: 'white',
                        border: '2px solid white'
                      }}>
                        {score}
                      </div>
                    </div>
                    
                    {/* Operator Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>{op.name}</p>
                        {isCurrent && (
                          <Badge status="info" label="Current" />
                        )}
                        {impactEvents > 0 && (
                          <Badge status="error" label={`${impactEvents} impacts`} />
                        )}
                        {isExpiringSoon && (
                          <Badge status="warning" label="Cert expiring" />
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: sp.lg, fontSize: '11px', color: C.neutral[500] }}>
                        <span>{hoursOnUnit} hrs on unit</span>
                        <span>Cert expires: {certExpiry}</span>
                      </div>
                    </div>
                    
                    {/* Driver Score Breakdown */}
                    <div style={{ display: 'flex', gap: sp.md, marginRight: sp.md }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>{Math.round(score * 0.95)}</p>
                        <p style={{ fontSize: '9px', color: C.neutral[500] }}>Safety</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>{Math.round(score * 1.02)}</p>
                        <p style={{ fontSize: '9px', color: C.neutral[500] }}>Efficiency</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>{Math.round(score * 0.98)}</p>
                        <p style={{ fontSize: '9px', color: C.neutral[500] }}>Care</p>
                      </div>
                    </div>
                    
                    <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Recent Activity on This Unit */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Recent Operator Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {[
                { op: equipment.certifiedOperators?.[0]?.name || 'J. Martinez', action: 'Completed shift', time: '2 hrs ago', duration: '6.5 hrs', pallets: 89 },
                { op: equipment.certifiedOperators?.[1]?.name || 'M. Chen', action: 'Started shift', time: 'Now', duration: '1.2 hrs', pallets: 18 },
                { op: equipment.certifiedOperators?.[0]?.name || 'J. Martinez', action: 'Impact event', time: 'Yesterday', duration: null, pallets: null, alert: true }
              ].map((activity, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm,
                  background: activity.alert ? C.error[50] : C.neutral[50],
                  borderRadius: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    {activity.alert ? (
                      <AlertTriangle style={{ width: 16, height: 16, color: C.error[500] }} />
                    ) : (
                      <Clock style={{ width: 16, height: 16, color: C.neutral[400] }} />
                    )}
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{activity.op}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{activity.action} • {activity.time}</p>
                    </div>
                  </div>
                  {activity.duration && (
                    <div style={{ display: 'flex', gap: sp.md, fontSize: '12px' }}>
                      <span style={{ color: C.neutral[600] }}>{activity.duration}</span>
                      <span style={{ color: C.brand[600], fontWeight: 500 }}>{activity.pallets} pallets</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
          
          {/* Training & Certification Status */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Certification Requirements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { cert: 'Forklift Operator License', required: true, ops: equipment.certifiedOperators?.length || 4, compliant: equipment.certifiedOperators?.length || 4 },
                { cert: 'Hazmat Handling', required: false, ops: equipment.certifiedOperators?.length || 4, compliant: 2 },
                { cert: 'Cold Storage Operations', required: false, ops: equipment.certifiedOperators?.length || 4, compliant: 3 }
              ].map((cert, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm,
                  background: C.neutral[50],
                  borderRadius: 6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ 
                      width: 8, height: 8, borderRadius: '50%', 
                      background: cert.compliant === cert.ops ? C.success[500] : C.warning[500] 
                    }} />
                    <span style={{ fontSize: '13px' }}>{cert.cert}</span>
                    {cert.required && <Badge status="info" label="Required" />}
                  </div>
                  <span style={{ fontSize: '12px', color: C.neutral[600] }}>
                    {cert.compliant}/{cert.ops} operators
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      
      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <>
          {/* Route Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Distance Today', value: `${equipment.routeStats?.totalDistanceToday || 0}`, unit: 'mi', sub: `${equipment.routeStats?.tripsToday || 0} trips` },
              { label: 'Avg Trip', value: `${equipment.routeStats?.avgTripDistance || 0}`, unit: 'mi', sub: `${equipment.routeStats?.avgTripTime || 0} min avg` },
              { label: 'Dead Travel', value: `${equipment.routeStats?.deadTravelPct || 0}`, unit: '%', sub: 'Empty returns', warn: (equipment.routeStats?.deadTravelPct || 0) > 15 },
              { label: 'Efficiency', value: `${equipment.routeStats?.efficiencyScore || 85}`, unit: '%', sub: 'vs optimal path', good: true }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>
                  {s.value}<span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Warehouse Floor Plan with Routes */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Travel Paths - Floor Plan View</h3>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Route frequency shown by line thickness. Click zones for details.</p>
              </div>
              <Badge status="info" label="This Week" />
            </div>
            
            {/* SVG Floor Plan */}
            <div style={{ background: C.neutral[50], borderRadius: 8, padding: sp.sm, position: 'relative' }}>
              <svg viewBox="0 0 600 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke={C.neutral[200]} strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="600" height="320" fill="url(#grid)"/>
                
                {/* Dock Area - Z01 */}
                <rect x="20" y="20" width="120" height="60" rx="4" fill={C.brand[100]} stroke={C.brand[400]} strokeWidth="2"/>
                <text x="80" y="42" textAnchor="middle" fontSize="11" fontWeight="600" fill={C.brand[700]}>Z01 - Inbound</text>
                <text x="80" y="56" textAnchor="middle" fontSize="9" fill={C.brand[600]}>Docks 1-8</text>
                {/* Dock doors */}
                <rect x="30" y="70" width="15" height="8" fill={C.brand[300]}/>
                <rect x="50" y="70" width="15" height="8" fill={C.brand[300]}/>
                <rect x="70" y="70" width="15" height="8" fill={C.brand[300]}/>
                <rect x="90" y="70" width="15" height="8" fill={C.brand[300]}/>
                <rect x="110" y="70" width="15" height="8" fill={C.brand[300]}/>
                
                {/* Staging - Z02 */}
                <rect x="160" y="20" width="100" height="60" rx="4" fill={C.warning[50]} stroke={C.warning[300]} strokeWidth="1"/>
                <text x="210" y="42" textAnchor="middle" fontSize="11" fontWeight="600" fill={C.warning[700]}>Z02 - Staging</text>
                <text x="210" y="56" textAnchor="middle" fontSize="9" fill={C.warning[600]}>Outbound Prep</text>
                
                {/* Forward Pick - Z03 */}
                <rect x="280" y="20" width="140" height="60" rx="4" fill={C.purple[50]} stroke={C.purple[300]} strokeWidth="1"/>
                <text x="350" y="42" textAnchor="middle" fontSize="11" fontWeight="600" fill={C.purple[700]}>Z03 - Forward Pick</text>
                <text x="350" y="56" textAnchor="middle" fontSize="9" fill={C.purple[600]}>High-velocity SKUs</text>
                
                {/* Outbound - Z05 */}
                <rect x="440" y="20" width="140" height="60" rx="4" fill={C.success[50]} stroke={C.success[100]} strokeWidth="1"/>
                <text x="510" y="42" textAnchor="middle" fontSize="11" fontWeight="600" fill={C.success[700]}>Z05 - Outbound</text>
                <text x="510" y="56" textAnchor="middle" fontSize="9" fill={C.success[600]}>Ship Docks</text>
                
                {/* Bulk Storage - Z04 (large area) */}
                <rect x="20" y="100" width="280" height="200" rx="4" fill={C.success[50]} stroke={C.success[100]} strokeWidth="1"/>
                <text x="160" y="125" textAnchor="middle" fontSize="13" fontWeight="600" fill={C.success[700]}>Z04 - Bulk Storage</text>
                {/* Aisle labels */}
                <text x="50" y="150" fontSize="9" fill={C.success[600]}>Aisle A</text>
                <text x="50" y="180" fontSize="9" fill={C.success[600]}>Aisle B</text>
                <text x="50" y="210" fontSize="9" fill={C.success[600]}>Aisle C</text>
                <text x="50" y="240" fontSize="9" fill={C.success[600]}>Aisle D</text>
                <text x="50" y="270" fontSize="9" fill={C.success[600]}>Aisle E</text>
                {/* Rack representations */}
                <rect x="80" y="145" width="200" height="8" fill={C.success[100]} rx="2"/>
                <rect x="80" y="175" width="200" height="8" fill={C.success[100]} rx="2"/>
                <rect x="80" y="205" width="200" height="8" fill={C.success[100]} rx="2"/>
                <rect x="80" y="235" width="200" height="8" fill={C.success[100]} rx="2"/>
                <rect x="80" y="265" width="200" height="8" fill={C.success[100]} rx="2"/>
                
                {/* Reserve - Z06 */}
                <rect x="320" y="100" width="260" height="200" rx="4" fill={C.neutral[100]} stroke={C.neutral[200]} strokeWidth="1"/>
                <text x="450" y="125" textAnchor="middle" fontSize="13" fontWeight="600" fill={C.neutral[600]}>Z06 - Reserve Storage</text>
                <text x="450" y="145" textAnchor="middle" fontSize="9" fill={C.neutral[500]}>Overflow / Seasonal</text>
                
                {/* === ROUTE PATHS === */}
                {/* Primary Route: Dock -> Bulk A (heaviest traffic) */}
                <path 
                  d="M 80 78 L 80 95 L 160 145" 
                  fill="none" 
                  stroke={C.brand[500]} 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
                {/* Return path (dashed, thinner) */}
                <path 
                  d="M 160 145 L 80 95 L 80 78" 
                  fill="none" 
                  stroke={C.brand[300]} 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
                
                {/* Secondary Route: Bulk -> Forward Pick (replenishment) */}
                <path 
                  d="M 200 175 L 260 95 L 350 80" 
                  fill="none" 
                  stroke={C.purple[500]} 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
                
                {/* Tertiary Route: Staging -> Outbound */}
                <path 
                  d="M 210 80 L 280 60 L 440 50" 
                  fill="none" 
                  stroke={C.success[500]} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  opacity="0.5"
                />
                
                {/* Route: Dock -> Bulk B */}
                <path 
                  d="M 100 78 L 100 98 L 160 180" 
                  fill="none" 
                  stroke={C.brand[400]} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
                
                {/* === STOP POINTS (with work activities) === */}
                {/* Stop 1: Dock Area - High Activity */}
                <circle cx="80" cy="60" r="12" fill={C.error[100]} stroke={C.error[500]} strokeWidth="2"/>
                <circle cx="80" cy="60" r="5" fill={C.error[500]}/>
                
                {/* Stop 2: Bulk A - High Activity */}
                <circle cx="160" cy="160" r="12" fill={C.error[100]} stroke={C.error[500]} strokeWidth="2"/>
                <circle cx="160" cy="160" r="5" fill={C.error[500]}/>
                
                {/* Stop 3: Bulk B - Medium Activity */}
                <circle cx="160" cy="190" r="10" fill={C.warning[100]} stroke={C.warning[500]} strokeWidth="2"/>
                <circle cx="160" cy="190" r="4" fill={C.warning[500]}/>
                
                {/* Stop 4: Forward Pick - Medium Activity */}
                <circle cx="350" cy="55" r="10" fill={C.warning[100]} stroke={C.warning[500]} strokeWidth="2"/>
                <circle cx="350" cy="55" r="4" fill={C.warning[500]}/>
                
                {/* Stop 5: Staging - Low Activity */}
                <circle cx="210" cy="55" r="8" fill={C.success[100]} stroke={C.success[500]} strokeWidth="2"/>
                <circle cx="210" cy="55" r="3" fill={C.success[500]}/>
                
                {/* Current Position Indicator */}
                <g>
                  <circle cx="80" cy="60" r="18" fill={C.brand[500]} opacity="0.2">
                    <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Equipment icon at current position */}
                <rect x="72" y="52" width="16" height="16" rx="2" fill={C.brand[600]}/>
                <text x="80" y="64" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">FL</text>
              </svg>
              
              {/* Legend */}
              <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <div style={{ width: 24, height: 4, background: C.brand[500], borderRadius: 2 }}/>
                  <span style={{ fontSize: '10px', color: C.neutral[600] }}>Primary route (45+ trips)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <div style={{ width: 24, height: 3, background: C.purple[500], borderRadius: 2 }}/>
                  <span style={{ fontSize: '10px', color: C.neutral[600] }}>Replenishment (28 trips)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <div style={{ width: 24, height: 2, background: C.brand[300], borderRadius: 2, borderStyle: 'dashed' }}/>
                  <span style={{ fontSize: '10px', color: C.neutral[600] }}>Return (empty)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.error[500] }}/>
                  <span style={{ fontSize: '10px', color: C.neutral[600] }}>High activity stop</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.warning[500] }}/>
                  <span style={{ fontSize: '10px', color: C.neutral[600] }}>Medium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success[500] }}/>
                  <span style={{ fontSize: '10px', color: C.neutral[600] }}>Low</span>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Stop Points with Work Activities */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Stop Points & Work Performed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {(equipment.stopPoints || []).filter(s => s.visits > 0).map((stop) => (
                <div 
                  key={stop.id}
                  onClick={() => onNavigateToZone && onNavigateToZone(stop.zoneId, stop.zone)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    padding: sp.md,
                    background: 'white',
                    border: `1px solid ${C.neutral[200]}`,
                    borderLeft: `4px solid ${stop.heatLevel === 'high' ? C.error[500] : stop.heatLevel === 'medium' ? C.warning[500] : C.success[500]}`,
                    borderRadius: '0 8px 8px 0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.neutral[50];
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    width: 40, height: 40, 
                    borderRadius: 8, 
                    background: stop.heatLevel === 'high' ? C.error[50] : stop.heatLevel === 'medium' ? C.warning[50] : C.success[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: sp.md,
                    flexShrink: 0
                  }}>
                    <MapPin style={{ 
                      width: 20, height: 20, 
                      color: stop.heatLevel === 'high' ? C.error[600] : stop.heatLevel === 'medium' ? C.warning[600] : C.success[600] 
                    }} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>{stop.location}</p>
                      <Badge status={stop.heatLevel === 'high' ? 'error' : stop.heatLevel === 'medium' ? 'warning' : 'success'} label={stop.heatLevel} />
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: sp.sm }}>{stop.zone}</p>
                    
                    {/* Work Activities */}
                    <div style={{ marginBottom: sp.sm }}>
                      <p style={{ fontSize: '10px', color: C.neutral[400], marginBottom: sp.xs }}>WORK PERFORMED</p>
                      <div style={{ display: 'flex', gap: sp.xs, flexWrap: 'wrap' }}>
                        {stop.activities.map((act, j) => (
                          <span key={j} style={{ 
                            fontSize: '11px', 
                            padding: '3px 8px', 
                            background: C.brand[50], 
                            borderRadius: 4,
                            color: C.brand[700],
                            fontWeight: 500
                          }}>
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Metrics row */}
                    <div style={{ display: 'flex', gap: sp.lg }}>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: C.neutral[800] }}>{stop.visits}</p>
                        <p style={{ fontSize: '9px', color: C.neutral[500] }}>visits/week</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: C.neutral[800] }}>{stop.avgDwell}m</p>
                        <p style={{ fontSize: '9px', color: C.neutral[500] }}>avg dwell</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: C.neutral[800] }}>{Math.round(stop.visits * stop.avgDwell)}m</p>
                        <p style={{ fontSize: '9px', color: C.neutral[500] }}>total time</p>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400], marginLeft: sp.sm, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </Card>
          
          {/* Frequent Routes Table */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Route Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {(equipment.commonRoutes || []).map((route, i) => (
                <div 
                  key={route.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: sp.sm,
                    background: C.neutral[50],
                    borderRadius: 6
                  }}
                >
                  <div style={{ 
                    width: 28, height: 28, 
                    borderRadius: 6, 
                    background: i === 0 ? C.brand[500] : i < 3 ? C.brand[200] : C.neutral[200],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: sp.sm,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: i === 0 ? 'white' : C.neutral[700]
                  }}>
                    {i + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: 2 }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{route.from}</span>
                      <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{route.to}</span>
                      <Badge status={route.activity.includes('Return') ? 'neutral' : 'info'} label={route.activity} />
                    </div>
                    <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', color: C.neutral[500] }}>
                      <span>{route.distance} mi</span>
                      <span>{route.avgTime} min avg</span>
                      <span style={{ color: i === 0 ? C.brand[600] : C.neutral[500] }}>{route.frequency} trips/wk</span>
                    </div>
                  </div>
                  
                  {/* Visual frequency bar */}
                  <div style={{ width: 60, marginLeft: sp.sm }}>
                    <div style={{ height: 6, background: C.neutral[200], borderRadius: 3 }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min((route.frequency / 50) * 100, 100)}%`, 
                        background: i === 0 ? C.brand[500] : C.brand[300], 
                        borderRadius: 3 
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Route Optimization Insights */}
          {(equipment.routeAlerts || []).length > 0 && (
            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Optimization Opportunities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {equipment.routeAlerts.map((alert, i) => (
                  <Alert key={i} {...alert} />
                ))}
              </div>
            </Card>
          )}
        </>
      )}
      
      {/* Location Tab */}
      {activeTab === 'location' && (
        <>
          {/* Location Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Current Zone', value: equipment.zone?.split(' ')[0] || 'Z04', sub: 'Bulk Storage' },
              { label: 'Time in Zone', value: '47', unit: 'm', sub: 'Current session' },
              { label: 'Zones Visited', value: 6, sub: 'Today', good: true },
              { label: 'Charging Visits', value: 2, sub: 'Last charged 3hr ago' }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.good ? C.success[600] : C.neutral[800] }}>
                  {s.value}{s.unit && <span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Current Location Card - Compact */}
          <Card 
            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
          >
            <div 
              onClick={() => onNavigateToZone && onNavigateToZone(equipment.zoneId, equipment.zone)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: sp.md
              }}
            >
              <div style={{ 
                width: 40, height: 40, borderRadius: 8, 
                background: C.brand[100], 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin style={{ width: 20, height: 20, color: C.brand[600] }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: C.brand[700], margin: 0 }}>{equipment.zone}</p>
                  <Badge status="success" label="Active" />
                </div>
                <p style={{ fontSize: '12px', color: C.neutral[500], margin: 0 }}>Aisle C, Bay 12 • Since 10:23 AM (47 min)</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400], flexShrink: 0 }} />
            </div>
          </Card>
          
          {/* Zone Dwell Time Breakdown */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Zone Time Distribution (Today)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { zone: 'Z04 - Bulk Storage', time: 185, pct: 45, color: C.success[500] },
                { zone: 'Z01 - Inbound Docks', time: 98, pct: 24, color: C.brand[500] },
                { zone: 'Z03 - Forward Pick', time: 62, pct: 15, color: C.purple[500] },
                { zone: 'Z02 - Staging', time: 41, pct: 10, color: C.warning[500] },
                { zone: 'Charging Station', time: 24, pct: 6, color: C.neutral[400] }
              ].map((z, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: z.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', flex: 1 }}>{z.zone}</span>
                  <span style={{ fontSize: '12px', color: C.neutral[600], minWidth: 50 }}>{z.time} min</span>
                  <div style={{ width: 100, height: 6, background: C.neutral[100], borderRadius: 3 }}>
                    <div style={{ width: `${z.pct}%`, height: '100%', background: z.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: '11px', color: C.neutral[500], minWidth: 30, textAlign: 'right' }}>{z.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Location Timeline */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Location Timeline</h3>
            <div style={{ position: 'relative', paddingLeft: sp.lg }}>
              {/* Timeline line */}
              <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 2, background: C.neutral[200] }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
                {(equipment.locationHistory || []).map((loc, i) => (
                  <div 
                    key={i} 
                    onClick={() => onNavigateToZone && onNavigateToZone(loc.zoneId, loc.zone)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: sp.sm,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    {/* Timeline dot */}
                    <div style={{ 
                      position: 'absolute', left: -20,
                      width: 12, height: 12, borderRadius: '50%', 
                      background: i === 0 ? C.brand[500] : C.neutral[300],
                      border: '2px solid white',
                      zIndex: 1
                    }} />
                    
                    <div style={{ 
                      flex: 1,
                      padding: sp.sm,
                      background: i === 0 ? C.brand[50] : C.neutral[50],
                      borderRadius: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: i === 0 ? 500 : 400 }}>{loc.zone}</span>
                        {i === 0 && <p style={{ fontSize: '11px', color: C.brand[600], marginTop: 2, margin: 0 }}>Current location</p>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                        <span style={{ fontSize: '11px', color: C.neutral[500] }}>{loc.time}</span>
                        <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
        </>
      )}
      
      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <>
          {/* Schedule Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'DVIR Status', value: 'Pass', sub: 'Inspected 6:00 AM', good: true },
              { label: 'Shift Assigned', value: 'Day', sub: '6AM - 2PM' },
              { label: 'Next PM', value: equipment.nextPMDue === 'Overdue' ? 'Overdue' : '3d', sub: `${equipment.hoursSincePM}/${equipment.pmInterval} hrs`, warn: equipment.hoursSincePM > equipment.pmInterval },
              { label: 'Events Today', value: 3, sub: 'Scheduled changes' }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: s.warn ? C.error[600] : s.good ? C.success[600] : C.neutral[800] }}>
                  {s.value}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Scheduled Events Today */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Scheduled Events Today</h3>
              <Badge status="info" label="3 upcoming" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { 
                  time: '14:00', 
                  type: 'zone', 
                  title: 'Move to Z03 - Forward Pick',
                  desc: 'Reassigned to support outbound surge. Expected 2hr assignment.',
                  icon: MapPin,
                  color: C.brand[500]
                },
                { 
                  time: '14:00', 
                  type: 'operator', 
                  title: 'Operator Handoff → M. Chen',
                  desc: 'Shift change. J. Martinez ending day shift.',
                  icon: Users,
                  color: C.purple[500]
                },
                { 
                  time: '16:30', 
                  type: 'task', 
                  title: 'Assigned to Outbound Loading',
                  desc: 'Priority trailer 847 departure at 17:00. Dock 5.',
                  icon: Package,
                  color: C.warning[500]
                }
              ].map((event, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: sp.md,
                    padding: sp.md,
                    background: C.neutral[50],
                    borderRadius: 8,
                    borderLeft: `4px solid ${event.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.neutral[50];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    minWidth: 50, 
                    padding: sp.xs, 
                    background: 'white', 
                    borderRadius: 4, 
                    textAlign: 'center',
                    border: `1px solid ${C.neutral[200]}`
                  }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>{event.time}</p>
                  </div>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: 6,
                    background: `${event.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <event.icon style={{ width: 16, height: 16, color: event.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: 2 }}>{event.title}</p>
                    <p style={{ fontSize: '12px', color: C.neutral[500] }}>{event.desc}</p>
                  </div>
                  <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400], alignSelf: 'center' }} />
                </div>
              ))}
            </div>
          </Card>
          
          {/* DVIR - Daily Vehicle Inspection Report */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Daily Vehicle Inspection (DVIR)</h3>
              <Badge status="success" label="Passed" />
            </div>
            <div style={{ 
              padding: sp.md, 
              background: C.success[50], 
              borderRadius: 8,
              borderLeft: `3px solid ${C.success[500]}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: C.success[700] }}>Pre-shift Inspection Complete</p>
                  <p style={{ fontSize: '12px', color: C.neutral[600], marginTop: sp.xs }}>Inspected by J. Martinez at 6:02 AM</p>
                </div>
                <CheckCircle style={{ width: 24, height: 24, color: C.success[500] }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm, marginTop: sp.md }}>
                {[
                  { item: 'Brakes', status: 'OK' },
                  { item: 'Forks', status: 'OK' },
                  { item: 'Lights', status: 'OK' },
                  { item: 'Horn', status: 'OK' },
                  { item: 'Hydraulics', status: 'OK' },
                  { item: 'Battery', status: 'OK' }
                ].map((check, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.success[500] }} />
                    <span style={{ fontSize: '11px', color: C.neutral[600] }}>{check.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Shift Assignment */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Shift Assignment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { shift: 'Day Shift', time: '6:00 AM - 2:00 PM', operator: equipment.certifiedOperators?.[0]?.name || 'J. Martinez', current: true },
                { shift: 'Swing Shift', time: '2:00 PM - 10:00 PM', operator: equipment.certifiedOperators?.[1]?.name || 'M. Chen', current: false },
                { shift: 'Night Shift', time: '10:00 PM - 6:00 AM', operator: 'Unassigned', current: false, unassigned: true }
              ].map((s, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm,
                  background: s.current ? C.brand[50] : C.neutral[50],
                  borderRadius: 6,
                  borderLeft: s.current ? `3px solid ${C.brand[500]}` : 'none'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <p style={{ fontSize: '13px', fontWeight: s.current ? 500 : 400 }}>{s.shift}</p>
                      {s.current && <Badge status="info" label="Current" />}
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>{s.time}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '12px', 
                      color: s.unassigned ? C.warning[600] : C.neutral[700],
                      fontWeight: 500
                    }}>
                      {s.operator}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Maintenance Schedule */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Maintenance Schedule</h3>
            <div style={{ 
              padding: sp.md, 
              background: equipment.nextPMDue === 'Overdue' ? C.error[50] : C.warning[50], 
              borderRadius: 8,
              borderLeft: `3px solid ${equipment.nextPMDue === 'Overdue' ? C.error[500] : C.warning[500]}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>Next Preventive Maintenance</p>
                  <p style={{ fontSize: '12px', color: C.neutral[600] }}>Every {equipment.pmInterval} operating hours</p>
                </div>
                <Badge status={equipment.nextPMDue === 'Overdue' ? 'error' : 'warning'} label={equipment.nextPMDue} />
              </div>
              <div style={{ marginTop: sp.sm }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.neutral[600] }}>
                  <span>Current hours: <strong>{equipment.hoursSincePM}</strong></span>
                  <span>Target: {equipment.pmInterval}</span>
                </div>
                <div style={{ 
                  height: 8, background: C.neutral[200], borderRadius: 4, marginTop: sp.xs, overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${Math.min((equipment.hoursSincePM / equipment.pmInterval) * 100, 100)}%`,
                    height: '100%',
                    background: equipment.hoursSincePM > equipment.pmInterval ? C.error[500] : equipment.hoursSincePM > equipment.pmInterval * 0.9 ? C.warning[500] : C.success[500],
                    borderRadius: 4
                  }} />
                </div>
              </div>
            </div>
            
            {/* Upcoming scheduled maintenance */}
            <div style={{ marginTop: sp.md }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600], marginBottom: sp.sm }}>UPCOMING</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                {[
                  { task: '250hr PM Service', due: 'Dec 20', tech: 'Mike Wilson', status: 'scheduled' },
                  { task: 'Battery Replacement', due: 'Jan 15', tech: 'TBD', status: 'planned' },
                  { task: 'Annual Safety Inspection', due: 'Feb 1', tech: 'External', status: 'planned' }
                ].map((task, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: sp.sm, background: C.neutral[50], borderRadius: 6
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <Calendar style={{ width: 14, height: 14, color: C.neutral[400] }} />
                      <div>
                        <p style={{ fontSize: '13px' }}>{task.task}</p>
                        <p style={{ fontSize: '11px', color: C.neutral[500] }}>{task.tech}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', fontWeight: 500 }}>{task.due}</p>
                      <Badge status={task.status === 'scheduled' ? 'info' : 'neutral'} label={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Maintenance History */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Maintenance History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {(equipment.maintenanceHistory || []).map((m, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm,
                  background: m.status === 'in-progress' ? C.warning[50] : C.neutral[50],
                  borderRadius: 6,
                  borderLeft: `3px solid ${m.status === 'in-progress' ? C.warning[500] : m.type === 'PM' ? C.brand[500] : C.neutral[300]}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Wrench style={{ width: 16, height: 16, color: C.neutral[400] }} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{m.desc}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{m.date} • {m.tech}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge status={m.type === 'PM' ? 'info' : m.status === 'in-progress' ? 'warning' : 'neutral'} label={m.type} />
                    <p style={{ fontSize: '12px', color: C.neutral[600], marginTop: 2 }}>${m.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Parts on Order */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Parts Inventory</h3>
            <div style={{ padding: sp.sm, background: C.success[50], borderRadius: 6, marginBottom: sp.sm }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <CheckCircle style={{ width: 16, height: 16, color: C.success[600] }} />
                <span style={{ fontSize: '13px', color: C.success[700] }}>All required parts in stock</span>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: C.neutral[500] }}>
              Common replacement parts for this unit are available in the maintenance shop.
            </p>
          </Card>
        </>
      )}
      
      {/* Fleet Tab */}
      {activeTab === 'fleet' && (
        <>
          {/* Fleet Comparison Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Fleet Rank', value: '#3', sub: `of ${equipment.fleet?.total || 8} units`, good: true },
              { label: 'vs Fleet Avg', value: '+8%', sub: 'Utilization', good: true },
              { label: 'Age', value: '3.2', unit: 'yrs', sub: 'Fleet avg: 4.1 yrs' },
              { label: 'Replacement', value: 'Low', sub: 'Priority score', good: true }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: s.good ? C.success[600] : s.warn ? C.warning[600] : C.neutral[800] }}>
                  {s.value}{s.unit && <span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* This Unit vs Fleet */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Performance vs Fleet</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
              {[
                { metric: 'Utilization', thisUnit: equipment.utilization || 78, fleetAvg: 72, unit: '%' },
                { metric: 'Maintenance Cost/hr', thisUnit: 4.20, fleetAvg: 5.10, unit: '$', lower: true },
                { metric: 'MTBF', thisUnit: 142, fleetAvg: 128, unit: 'hrs' },
                { metric: 'Availability', thisUnit: 94, fleetAvg: 91, unit: '%' },
                { metric: 'Driver Score Avg', thisUnit: 87, fleetAvg: 84, unit: '%' }
              ].map((m, i) => {
                const isBetter = m.lower ? m.thisUnit < m.fleetAvg : m.thisUnit > m.fleetAvg;
                const diff = m.lower ? m.fleetAvg - m.thisUnit : m.thisUnit - m.fleetAvg;
                const diffPct = ((diff / m.fleetAvg) * 100).toFixed(0);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <span style={{ fontSize: '12px', color: C.neutral[600], width: 140 }}>{m.metric}</span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <div style={{ flex: 1, height: 8, background: C.neutral[100], borderRadius: 4, position: 'relative' }}>
                        {/* Fleet avg marker */}
                        <div style={{ 
                          position: 'absolute', 
                          left: `${Math.min((m.fleetAvg / (m.fleetAvg * 1.3)) * 100, 100)}%`,
                          top: -4,
                          bottom: -4,
                          width: 2,
                          background: C.neutral[400]
                        }} />
                        {/* This unit bar */}
                        <div style={{ 
                          width: `${Math.min((m.thisUnit / (m.fleetAvg * 1.3)) * 100, 100)}%`,
                          height: '100%',
                          background: isBetter ? C.success[500] : C.warning[500],
                          borderRadius: 4
                        }} />
                      </div>
                    </div>
                    <div style={{ width: 70, textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{m.thisUnit}{m.unit}</span>
                    </div>
                    <div style={{ width: 50 }}>
                      <Badge 
                        status={isBetter ? 'success' : 'warning'} 
                        label={`${isBetter ? '+' : ''}${diffPct}%`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.md, fontSize: '10px', color: C.neutral[500] }}>
              <div style={{ width: 20, height: 2, background: C.neutral[400] }} />
              <span>Fleet average</span>
            </div>
          </Card>
          
          {/* Total Cost of Ownership */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Total Cost of Ownership</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp.md }}>
              <div>
                <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: sp.xs }}>THIS UNIT (YTD)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.xs, background: C.neutral[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '12px' }}>Acquisition (amortized)</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>$4,200</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.xs, background: C.neutral[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '12px' }}>Maintenance</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>${equipment.maintenanceCostYTD?.toLocaleString() || '2,450'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.xs, background: C.neutral[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '12px' }}>Energy</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>$890</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.sm, background: C.brand[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Total TCO</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: C.brand[600] }}>$7,540</span>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: sp.xs }}>FLEET AVERAGE (YTD)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.xs, background: C.neutral[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '12px' }}>Acquisition (amortized)</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>$4,800</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.xs, background: C.neutral[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '12px' }}>Maintenance</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>$3,120</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.xs, background: C.neutral[50], borderRadius: 4 }}>
                    <span style={{ fontSize: '12px' }}>Energy</span>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>$950</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: sp.sm, background: C.neutral[100], borderRadius: 4 }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Total TCO</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>$8,870</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ 
              marginTop: sp.md, padding: sp.sm, 
              background: C.success[50], borderRadius: 6, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.sm 
            }}>
              <TrendingDown style={{ width: 16, height: 16, color: C.success[600] }} />
              <span style={{ fontSize: '13px', color: C.success[700], fontWeight: 500 }}>
                15% below fleet average TCO
              </span>
            </div>
          </Card>
          
          {/* Replacement Assessment */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Replacement Assessment</h3>
              <Badge status="success" label="Keep" />
            </div>
            <div style={{ padding: sp.md, background: C.success[50], borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{ 
                  width: 60, height: 60, borderRadius: '50%', 
                  background: C.success[100], 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `4px solid ${C.success[500]}`
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: C.success[700] }}>82</span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: C.success[700] }}>Low Replacement Priority</p>
                  <p style={{ fontSize: '12px', color: C.neutral[600] }}>
                    Unit is performing well with below-average costs and above-average reliability.
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm, marginTop: sp.md }}>
                {[
                  { factor: 'Age', score: 85, note: '3.2 yrs / 7yr lifecycle' },
                  { factor: 'Condition', score: 78, note: 'Good mechanical health' },
                  { factor: 'Economics', score: 88, note: 'Below-avg TCO' }
                ].map((f, i) => (
                  <div key={i} style={{ padding: sp.sm, background: 'white', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
                      <span style={{ fontSize: '11px', color: C.neutral[600] }}>{f.factor}</span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: C.success[600] }}>{f.score}</span>
                    </div>
                    <div style={{ height: 4, background: C.neutral[100], borderRadius: 2 }}>
                      <div style={{ width: `${f.score}%`, height: '100%', background: C.success[500], borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: '9px', color: C.neutral[500], marginTop: 2 }}>{f.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Fleet Units List */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Fleet Comparison</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {[
                { id: 'FL-03', util: 82, status: 'Active', rank: 1 },
                { id: 'FL-01', util: 79, status: 'Active', rank: 2 },
                { id: equipment.id, util: equipment.utilization || 78, status: equipment.status, rank: 3, current: true },
                { id: 'FL-08', util: 75, status: 'Active', rank: 4 },
                { id: 'FL-02', util: 71, status: 'Idle', rank: 5 },
              ].map((unit, i) => (
                <div 
                  key={i} 
                  onClick={() => !unit.current && onNavigateToEquipment && onNavigateToEquipment(unit.id, unit.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: sp.sm,
                    background: unit.current ? C.brand[50] : C.neutral[50],
                    borderRadius: 6,
                    borderLeft: unit.current ? `3px solid ${C.brand[500]}` : 'none',
                    cursor: unit.current ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!unit.current) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!unit.current) {
                      e.currentTarget.style.background = C.neutral[50];
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ 
                      width: 24, height: 24, borderRadius: '50%',
                      background: unit.rank <= 3 ? C.success[100] : C.neutral[200],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 600,
                      color: unit.rank <= 3 ? C.success[700] : C.neutral[600]
                    }}>
                      {unit.rank}
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: unit.current ? 500 : 400 }}>{unit.id}</span>
                      {unit.current && <span style={{ fontSize: '11px', color: C.brand[600], marginLeft: sp.xs }}>(This unit)</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                    <span style={{ fontSize: '12px', color: C.neutral[600] }}>{unit.util}% util</span>
                    <Badge status={unit.status === 'Active' ? 'success' : 'neutral'} label={unit.status} />
                    {!unit.current && <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <>
          {/* Insight Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Active Alerts', value: equipment.alerts?.length || 0, sub: 'Requiring attention', warn: (equipment.alerts?.length || 0) > 0 },
              { label: 'Anomalies', value: 2, sub: 'Detected this week', warn: true },
              { label: 'Trend', value: 'Stable', sub: 'Overall health', good: true },
              { label: 'Confidence', value: 87, unit: '%', sub: 'Prediction accuracy' }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>
                  {s.value}{s.unit && <span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Analysis */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Analysis</h3>
            {(equipment.alerts?.length || 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {equipment.alerts.map((alert, i) => (
                  <Alert 
                    key={i} 
                    {...alert} 
                    onClick={() => onNavigateToAlert && onNavigateToAlert(alert.id, 'equipment', true)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: sp.lg, background: C.success[50], borderRadius: 8, textAlign: 'center' }}>
                <CheckCircle style={{ width: 32, height: 32, color: C.success[600], marginBottom: sp.sm }} />
                <p style={{ color: C.success[700] }}>No active alerts for this unit</p>
              </div>
            )}
          </Card>
          
          {/* Anomaly Detection */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Anomaly Detection</h3>
              <Badge status="warning" label="2 detected" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { 
                  anomaly: 'Unusual idle pattern', 
                  detected: '2 days ago',
                  desc: 'Unit idle for 45+ min during peak hours (unusual for this operator)',
                  severity: 'low',
                  suggestion: 'May indicate training need or assignment issue'
                },
                { 
                  anomaly: 'Battery drain rate elevated', 
                  detected: 'Yesterday',
                  desc: 'Draining 15% faster than baseline. Possible battery degradation.',
                  severity: 'medium',
                  suggestion: 'Schedule battery health check'
                }
              ].map((a, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: sp.md,
                    background: a.severity === 'medium' ? C.warning[50] : C.neutral[50],
                    borderRadius: 8,
                    borderLeft: `4px solid ${a.severity === 'medium' ? C.warning[500] : C.neutral[300]}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = a.severity === 'medium' ? C.warning[50] : C.neutral[50];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{a.anomaly}</p>
                    <span style={{ fontSize: '11px', color: C.neutral[500] }}>{a.detected}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: C.neutral[600], marginBottom: sp.sm }}>{a.desc}</p>
                  <div style={{ 
                    padding: sp.sm, background: 'white', borderRadius: 6,
                    display: 'flex', alignItems: 'center', gap: sp.sm
                  }}>
                    <Lightbulb style={{ width: 16, height: 16, color: C.warning[500], flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: C.neutral[700] }}>{a.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Root Cause Analysis */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Root Cause Analysis</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500], marginBottom: sp.md }}>
              Contributing factors to recent maintenance events
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { cause: 'High utilization hours', pct: 35, color: C.brand[500] },
                { cause: 'Operator behavior patterns', pct: 25, color: C.purple[500] },
                { cause: 'Environmental conditions', pct: 20, color: C.warning[500] },
                { cause: 'Component age', pct: 15, color: C.neutral[400] },
                { cause: 'Other factors', pct: 5, color: C.neutral[300] }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', flex: 1 }}>{c.cause}</span>
                  <div style={{ width: 120, height: 6, background: C.neutral[100], borderRadius: 3 }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: '11px', color: C.neutral[600], width: 35, textAlign: 'right' }}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* What-If Scenarios */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>What-If Scenarios</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500], marginBottom: sp.md }}>
              Projected impact of potential changes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { 
                  scenario: 'Reduce daily hours by 1hr', 
                  impact: 'Extends next PM by ~3 days',
                  effect: 'positive',
                  metric: '+12%',
                  metricLabel: 'Remaining life'
                },
                { 
                  scenario: 'Add operator rotation', 
                  impact: 'Distributes wear patterns across shifts',
                  effect: 'positive',
                  metric: '-8%',
                  metricLabel: 'Breakdown risk'
                },
                { 
                  scenario: 'Delay PM by 1 week', 
                  impact: 'Increased breakdown probability',
                  effect: 'negative',
                  metric: '+23%',
                  metricLabel: 'Failure risk'
                }
              ].map((s, i) => (
                <div key={i} style={{ 
                  padding: sp.md,
                  background: C.neutral[50],
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.md
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: 2 }}>{s.scenario}</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>{s.impact}</p>
                  </div>
                  <div style={{ 
                    textAlign: 'center', padding: sp.sm, borderRadius: 6,
                    background: s.effect === 'positive' ? C.success[50] : C.error[50]
                  }}>
                    <p style={{ 
                      fontSize: '16px', fontWeight: 600, 
                      color: s.effect === 'positive' ? C.success[600] : C.error[600] 
                    }}>
                      {s.metric}
                    </p>
                    <p style={{ fontSize: '9px', color: C.neutral[500] }}>{s.metricLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Performance Trends */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Trend Analysis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { metric: 'Utilization', current: 78, prev: 82, trend: 'down' },
                { metric: 'Maintenance frequency', current: 1.2, prev: 1.5, trend: 'down', lower: true, unit: '/mo' },
                { metric: 'Avg trip efficiency', current: 85, prev: 81, trend: 'up', unit: '%' },
                { metric: 'Operator satisfaction', current: 4.2, prev: 4.0, trend: 'up', unit: '/5' }
              ].map((t, i) => {
                const isBetter = t.lower ? t.trend === 'down' : t.trend === 'up';
                return (
                  <div key={i} style={{ 
                    padding: sp.sm, background: C.neutral[50], borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '13px' }}>{t.metric}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>
                        {t.current}{t.unit || '%'}
                      </span>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: 2,
                        color: isBetter ? C.success[600] : C.warning[600]
                      }}>
                        {t.trend === 'up' ? (
                          <TrendingUp style={{ width: 14, height: 14 }} />
                        ) : (
                          <TrendingDown style={{ width: 14, height: 14 }} />
                        )}
                        <span style={{ fontSize: '11px' }}>
                          {t.trend === 'up' ? '+' : ''}{((t.current - t.prev) / t.prev * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
      
      {/* Config Tab */}
      {activeTab === 'config' && (
        <>
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Unit Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
              {[
                { label: 'Asset ID', value: equipment.id },
                { label: 'Type', value: equipment.type },
                { label: 'Manufacturer', value: equipment.manufacturer },
                { label: 'Model', value: equipment.model },
                { label: 'Serial Number', value: equipment.serialNumber },
                { label: 'Purchase Date', value: equipment.purchaseDate },
                { label: 'PM Interval', value: `${equipment.pmInterval} hours` },
                { label: 'Last PM', value: equipment.lastPMDate }
              ].map((item, i) => (
                <div key={i} style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500], textTransform: 'uppercase' }}>{item.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {/* Work Tab */}
      {activeTab === 'work' && (
        <>
          {/* Work Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Pallets Today', value: 248, sub: 'vs 220 target', good: true },
              { label: 'Pallets/Hour', value: 42, sub: 'Fleet avg: 38', good: true },
              { label: 'Idle Time', value: 12, unit: '%', sub: 'Last 8 hours', warn: true },
              { label: 'Lift Cycles', value: 312, sub: 'Today' }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>
                  {s.value}{s.unit && <span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Throughput Chart */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Hourly Throughput</h3>
            <div style={{ display: 'flex', gap: sp.xs, alignItems: 'flex-end', height: 100 }}>
              {[
                { hour: '6AM', pallets: 28 },
                { hour: '7AM', pallets: 45 },
                { hour: '8AM', pallets: 52 },
                { hour: '9AM', pallets: 48 },
                { hour: '10AM', pallets: 42 },
                { hour: '11AM', pallets: 33 },
                { hour: 'Now', pallets: 0, current: true }
              ].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '80%', 
                    height: Math.max((h.pallets / 55) * 70, 2),
                    background: h.current ? C.neutral[200] : h.pallets >= 45 ? C.success[500] : h.pallets >= 35 ? C.brand[500] : C.warning[500],
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '10px', color: C.neutral[500], marginTop: sp.xs }}>{h.hour}</span>
                  {!h.current && <span style={{ fontSize: '11px', fontWeight: 500 }}>{h.pallets}</span>}
                </div>
              ))}
            </div>
          </Card>
          
          {/* Work Breakdown */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Work Breakdown (Today)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { task: 'Putaway', count: 98, time: 124, pct: 40, color: C.brand[500] },
                { task: 'Replenishment', count: 62, time: 78, pct: 25, color: C.purple[500] },
                { task: 'Picking', count: 48, time: 54, pct: 19, color: C.success[500] },
                { task: 'Loading', count: 28, time: 32, pct: 11, color: C.warning[500] },
                { task: 'Other', count: 12, time: 14, pct: 5, color: C.neutral[400] }
              ].map((w, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: w.color }} />
                      <span style={{ fontSize: '13px' }}>{w.task}</span>
                    </div>
                    <div style={{ display: 'flex', gap: sp.md, fontSize: '12px', color: C.neutral[600] }}>
                      <span>{w.count} pallets</span>
                      <span>{w.time} min</span>
                      <span style={{ fontWeight: 500 }}>{w.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: C.neutral[100], borderRadius: 3 }}>
                    <div style={{ width: `${w.pct}%`, height: '100%', background: w.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Cycle Times */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Cycle Times</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.sm }}>
              {[
                { label: 'Avg Load Time', value: 1.8, unit: 'min', benchmark: 2.0, good: true },
                { label: 'Avg Unload Time', value: 1.5, unit: 'min', benchmark: 1.8, good: true },
                { label: 'Avg Travel (loaded)', value: 2.4, unit: 'min', benchmark: 2.5, good: true },
                { label: 'Avg Travel (empty)', value: 1.9, unit: 'min', benchmark: 2.0, good: true }
              ].map((c, i) => (
                <div key={i} style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: C.neutral[600] }}>{c.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: c.good ? C.success[600] : C.warning[600] }}>
                      {c.value} {c.unit}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginTop: sp.xs }}>
                    <div style={{ flex: 1, height: 4, background: C.neutral[200], borderRadius: 2 }}>
                      <div style={{ 
                        width: `${Math.min((c.value / c.benchmark) * 100, 100)}%`,
                        height: '100%',
                        background: c.good ? C.success[500] : C.warning[500],
                        borderRadius: 2
                      }} />
                    </div>
                    <span style={{ fontSize: '10px', color: C.neutral[400] }}>/{c.benchmark}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Activity Timeline */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {[
                { time: '11:08', action: 'Putaway completed', location: 'Bulk A, Row 12', pallets: 2, zoneId: 'z04' },
                { time: '11:02', action: 'Travel to dock', location: 'Dock 3', pallets: 0, travel: true, zoneId: 'z01' },
                { time: '10:54', action: 'Load pickup', location: 'Dock 3', pallets: 2, zoneId: 'z01' },
                { time: '10:48', action: 'Idle', location: 'Dock staging', pallets: 0, idle: true, zoneId: 'z01' },
                { time: '10:41', action: 'Putaway completed', location: 'Bulk A, Row 8', pallets: 2, zoneId: 'z04' }
              ].map((a, i) => (
                <div 
                  key={i} 
                  onClick={() => onNavigateToZone && onNavigateToZone(a.zoneId, a.location)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: sp.sm,
                    padding: sp.sm,
                    background: a.idle ? C.warning[50] : C.neutral[50],
                    borderRadius: 6,
                    borderLeft: `3px solid ${a.idle ? C.warning[500] : a.travel ? C.neutral[300] : C.success[500]}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = a.idle ? C.warning[50] : C.neutral[50];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '11px', color: C.neutral[500], minWidth: 45 }}>{a.time}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: a.idle ? 400 : 500 }}>{a.action}</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>{a.location}</p>
                  </div>
                  {a.pallets > 0 && (
                    <Badge status="info" label={`${a.pallets} pallets`} />
                  )}
                  <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                </div>
              ))}
            </div>
          </Card>
          
          {/* Weekly Summary */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Weekly Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300 }}>1,240</p>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Total Pallets</p>
              </div>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300 }}>29.5</p>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Active Hours</p>
              </div>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300, color: C.success[600] }}>112%</p>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>vs Target</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default EquipmentDetailContent;
