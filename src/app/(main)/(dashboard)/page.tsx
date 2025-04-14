'use client';

import Link from 'next/link';
import { Button, Typography, Row, Col, Card } from 'antd';

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <Title level={2} className="mb-6">Dashboard</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link href="/subjects" className="no-underline">
            <Card 
              hoverable 
              className="h-full"
              cover={
                <div className="h-32 bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Subjects</span>
                </div>
              }
            >
              <Card.Meta
                title="Browse Subjects"
                description="Explore all available subjects and resources"
              />
              <Button type="primary" className="mt-4 w-full">
                View Subjects
              </Button>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}