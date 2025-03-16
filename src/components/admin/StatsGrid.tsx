
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy statistics data - in a real app, this would come from a database
const generateDummyStats = () => {
  // Poem count for each audience type
  const audienceData = [
    { name: 'Erwachsene', value: Math.floor(Math.random() * 1000) + 500, todayValue: Math.floor(Math.random() * 20) + 5 },
    { name: 'Kinder', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 15) + 2 },
    { name: 'Partner', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Familie', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 10) + 1 },
    { name: 'Freunde', value: Math.floor(Math.random() * 500) + 250, todayValue: Math.floor(Math.random() * 8) + 1 },
    { name: 'Kollegen', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
  ];

  // Poem count for each occasion
  const occasionData = [
    { name: 'Geburtstag', value: Math.floor(Math.random() * 1200) + 600, todayValue: Math.floor(Math.random() * 25) + 8 },
    { name: 'Hochzeit', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 15) + 5 },
    { name: 'Jubiläum', value: Math.floor(Math.random() * 500) + 250, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Trauerfall', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Weihnachten', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Valentinstag', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 8) + 2 },
    { name: 'Andere', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 6) + 1 },
  ];

  // Poem count for each style
  const styleData = [
    { name: 'Sonett', value: Math.floor(Math.random() * 600) + 300, todayValue: Math.floor(Math.random() * 10) + 2 },
    { name: 'Ballade', value: Math.floor(Math.random() * 400) + 200, todayValue: Math.floor(Math.random() * 8) + 1 },
    { name: 'Ode', value: Math.floor(Math.random() * 300) + 150, todayValue: Math.floor(Math.random() * 5) + 1 },
    { name: 'Hymne', value: Math.floor(Math.random() * 250) + 125, todayValue: Math.floor(Math.random() * 4) + 1 },
    { name: 'Elfchen', value: Math.floor(Math.random() * 700) + 350, todayValue: Math.floor(Math.random() * 12) + 3 },
    { name: 'Klassisch', value: Math.floor(Math.random() * 1000) + 500, todayValue: Math.floor(Math.random() * 20) + 5 },
    { name: 'Modern', value: Math.floor(Math.random() * 800) + 400, todayValue: Math.floor(Math.random() * 15) + 4 },
    { name: 'Romantisch', value: Math.floor(Math.random() * 900) + 450, todayValue: Math.floor(Math.random() * 18) + 5 },
  ];

  const totalPoems = audienceData.reduce((sum, item) => sum + item.value, 0);
  const todayPoems = audienceData.reduce((sum, item) => sum + item.todayValue, 0);

  return {
    totalPoems,
    todayPoems,
    audienceData,
    occasionData,
    styleData
  };
};

const stats = generateDummyStats();

const chartConfig = {
  total: {
    label: "Gesamt",
    theme: {
      light: "#3182CE",
      dark: "#3182CE",
    },
  },
  today: {
    label: "Heute",
    theme: {
      light: "#DD6B20",
      dark: "#DD6B20",
    },
  },
};

const StatsGrid = () => {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Statistiken</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Gedichte insgesamt</h3>
            <p className="text-4xl font-bold">{stats.totalPoems.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Gedichte heute</h3>
            <p className="text-4xl font-bold">{stats.todayPoems.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="audience">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="audience">Zielgruppe</TabsTrigger>
          <TabsTrigger value="occasion">Anlass</TabsTrigger>
          <TabsTrigger value="style">Stil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audience">
          <Card>
            <CardContent className="p-6 pt-8">
              <h3 className="text-lg font-medium mb-4">Gedichte nach Zielgruppe</h3>
              <div className="mb-8">
                <ChartContainer 
                  config={chartConfig} 
                  className="aspect-[4/3] w-full h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.audienceData.map(item => ({ 
                        name: item.name, 
                        total: item.value,
                        today: item.todayValue
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" name="Gesamt" fill="#3182CE" />
                      <Bar dataKey="today" name="Heute" fill="#DD6B20" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend className="mt-4 justify-center">
                  <ChartLegendContent />
                </ChartLegend>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zielgruppe</TableHead>
                    <TableHead className="text-right">Gesamt</TableHead>
                    <TableHead className="text-right">Heute</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.audienceData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.todayValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occasion">
          <Card>
            <CardContent className="p-6 pt-8">
              <h3 className="text-lg font-medium mb-4">Gedichte nach Anlass</h3>
              <div className="mb-8">
                <ChartContainer 
                  config={chartConfig} 
                  className="aspect-[4/3] w-full h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.occasionData.map(item => ({ 
                        name: item.name, 
                        total: item.value,
                        today: item.todayValue
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" name="Gesamt" fill="#3182CE" />
                      <Bar dataKey="today" name="Heute" fill="#DD6B20" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend className="mt-4 justify-center">
                  <ChartLegendContent />
                </ChartLegend>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anlass</TableHead>
                    <TableHead className="text-right">Gesamt</TableHead>
                    <TableHead className="text-right">Heute</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.occasionData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.todayValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="style">
          <Card>
            <CardContent className="p-6 pt-8">
              <h3 className="text-lg font-medium mb-4">Gedichte nach Stil</h3>
              <div className="mb-8">
                <ChartContainer 
                  config={chartConfig} 
                  className="aspect-[4/3] w-full h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.styleData.map(item => ({ 
                        name: item.name, 
                        total: item.value,
                        today: item.todayValue
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" name="Gesamt" fill="#3182CE" />
                      <Bar dataKey="today" name="Heute" fill="#DD6B20" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend className="mt-4 justify-center">
                  <ChartLegendContent />
                </ChartLegend>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stil</TableHead>
                    <TableHead className="text-right">Gesamt</TableHead>
                    <TableHead className="text-right">Heute</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.styleData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.todayValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsGrid;
