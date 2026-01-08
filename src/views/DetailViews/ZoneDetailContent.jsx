import React from 'react';
import { MapPin } from 'lucide-react';
import { C, sp } from '../../styles/designSystem';
import { Card } from '../../components/UI';

const ZoneDetailContent = ({ zoneId, activeTab, onNavigateToStaff, onNavigateToZone, onNavigateToEquipment, onNavigateToAlert }) => {
  return (
    <Card>
      <div style={{ padding: sp.xl, textAlign: 'center' }}>
        <MapPin style={{ width: 48, height: 48, color: C.brand[400], marginBottom: sp.md }} />
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.sm }}>Zone Detail: {zoneId}</h3>
        <p style={{ fontSize: '13px', color: C.neutral[500] }}>Zone detail view coming soon</p>
        <p style={{ fontSize: '12px', color: C.neutral[400], marginTop: sp.sm }}>Current tab: {activeTab}</p>
      </div>
    </Card>
  );
};

export default ZoneDetailContent;
