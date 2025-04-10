
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Download, Mail, Share2, MessageSquare } from "lucide-react";
import { useTimetableStore } from "@/stores/timetableStore";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShareTimetable() {
  const location = useLocation();
  const locationState = location.state as { defaultTab?: string; type?: 'master' | 'teacher' | 'class'; id?: string } | null;
  
  const [selectedTab, setSelectedTab] = useState<string>(locationState?.defaultTab || 'link');
  const [selectedType, setSelectedType] = useState<'master' | 'teacher' | 'class'>(locationState?.type || 'master');
  const [selectedId, setSelectedId] = useState<string | undefined>(locationState?.id);
  const [emailAddresses, setEmailAddresses] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('Your Timetable from ACADSYNC');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { 
    teachers, 
    classes, 
    getTimetableShareLink, 
    shareTimetableViaWhatsApp, 
    shareTimetableViaEmail,
    exportToCsv,
    exportToJson
  } = useTimetableStore();
  
  // Update selected tab when location state changes
  useEffect(() => {
    if (locationState?.defaultTab) {
      setSelectedTab(locationState.defaultTab);
    }
    if (locationState?.type) {
      setSelectedType(locationState.type);
    }
    if (locationState?.id) {
      setSelectedId(locationState.id);
    }
  }, [locationState]);
  
  const shareLink = getTimetableShareLink(selectedType, selectedId);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };
  
  const handleSendEmail = async () => {
    if (!emailAddresses) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await shareTimetableViaEmail(
        emailAddresses,
        emailSubject,
        emailMessage,
        selectedType,
        selectedId
      );
      
      if (success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending the email");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWhatsApp = () => {
    shareTimetableViaWhatsApp(selectedType, selectedId);
  };
  
  const handleDownload = (format: 'pdf' | 'excel' | 'image' | 'csv' | 'json') => {
    switch (format) {
      case 'csv':
        exportToCsv(selectedType, selectedId);
        break;
      case 'json':
        exportToJson(selectedType, selectedId);
        break;
      case 'pdf':
      case 'excel':
      case 'image':
        // For demo purposes, we'll just show a toast
        toast.success(`Downloading timetable as ${format.toUpperCase()}`);
        break;
    }
  };

  // Helper to get display name for type and ID
  const getDisplayName = () => {
    if (selectedType === 'master') {
      return 'Master Timetable';
    } else if (selectedType === 'teacher' && selectedId) {
      const teacher = teachers.find(t => t.id === selectedId);
      return teacher ? teacher.name : 'Unknown Teacher';
    } else if (selectedType === 'class' && selectedId) {
      const classItem = classes.find(c => c.id === selectedId);
      return classItem ? `${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}` : 'Unknown Class';
    }
    return 'Timetable';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Share Timetable</h1>
        <p className="text-muted-foreground">
          Share timetables with teachers, students, and staff
        </p>
      </div>
      
      <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="link">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="download">
            <Download className="h-4 w-4 mr-2" />
            Download
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share via Link</CardTitle>
              <CardDescription>
                Create and copy a shareable link to your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timetable-select">Select Timetable</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={`${selectedType}${selectedId ? `-${selectedId}` : ''}`}
                  onChange={(e) => {
                    const [type, id] = e.target.value.split('-');
                    setSelectedType(type as 'master' | 'teacher' | 'class');
                    setSelectedId(id);
                  }}
                >
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={`teacher-${teacher.id}`}>
                        {teacher.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Class Timetables">
                    {classes.map(classItem => (
                      <option key={classItem.id} value={`class-${classItem.id}`}>
                        {`${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">Shareable Link</Label>
                <div className="flex">
                  <Input 
                    id="link" 
                    value={shareLink} 
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button 
                    className="rounded-l-none bg-acadsync-500 hover:bg-acadsync-700"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Share Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline" onClick={() => window.open(shareLink, '_blank')}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Open in Browser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share via Email</CardTitle>
              <CardDescription>
                Send the timetable to one or multiple email addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timetable-select">Select Timetable</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={`${selectedType}${selectedId ? `-${selectedId}` : ''}`}
                  onChange={(e) => {
                    const [type, id] = e.target.value.split('-');
                    setSelectedType(type as 'master' | 'teacher' | 'class');
                    setSelectedId(id);
                  }}
                >
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={`teacher-${teacher.id}`}>
                        {teacher.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Class Timetables">
                    {classes.map(classItem => (
                      <option key={classItem.id} value={`class-${classItem.id}`}>
                        {`${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address(es)</Label>
                <Input 
                  id="email" 
                  type="text"
                  placeholder="Enter email addresses separated by commas"
                  value={emailAddresses}
                  onChange={(e) => setEmailAddresses(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can enter multiple email addresses separated by commas
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input 
                  id="subject" 
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <textarea 
                  id="message" 
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  placeholder="Add a personal message to the email"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                ></textarea>
              </div>
              
              <Button 
                className="w-full bg-acadsync-500 hover:bg-acadsync-700" 
                onClick={handleSendEmail}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share via WhatsApp</CardTitle>
              <CardDescription>
                Send the timetable via WhatsApp message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timetable-select">Select Timetable</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={`${selectedType}${selectedId ? `-${selectedId}` : ''}`}
                  onChange={(e) => {
                    const [type, id] = e.target.value.split('-');
                    setSelectedType(type as 'master' | 'teacher' | 'class');
                    setSelectedId(id);
                  }}
                >
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={`teacher-${teacher.id}`}>
                        {teacher.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Class Timetables">
                    {classes.map(classItem => (
                      <option key={classItem.id} value={`class-${classItem.id}`}>
                        {`${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">WhatsApp Message</Label>
                <textarea 
                  id="message" 
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  defaultValue={`Here is your timetable from ACADSYNC. Click the link to view: ${shareLink}`}
                  readOnly
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <Label>Sharing Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleWhatsApp}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Personal Chat
                  </Button>
                  <Button variant="outline" onClick={handleWhatsApp}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Group Chat
                  </Button>
                </div>
              </div>
              
              <Button className="w-full bg-acadsync-500 hover:bg-acadsync-700" onClick={handleWhatsApp}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Open WhatsApp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Timetable</CardTitle>
              <CardDescription>
                Download the timetable in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timetable-select">Select Timetable</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={`${selectedType}${selectedId ? `-${selectedId}` : ''}`}
                  onChange={(e) => {
                    const [type, id] = e.target.value.split('-');
                    setSelectedType(type as 'master' | 'teacher' | 'class');
                    setSelectedId(id);
                  }}
                >
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={`teacher-${teacher.id}`}>
                        {teacher.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Class Timetables">
                    {classes.map(classItem => (
                      <option key={classItem.id} value={`class-${classItem.id}`}>
                        {`${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Select Format</Label>
                <select id="format" className="w-full p-2 border rounded-md">
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="image">Image (PNG)</option>
                  <option value="csv">CSV File</option>
                  <option value="json">JSON File</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Download Options</Label>
                <div className="grid gap-2">
                  <Button 
                    className="w-full bg-acadsync-500 hover:bg-acadsync-700" 
                    onClick={() => {
                      const format = (document.getElementById('format') as HTMLSelectElement).value as 'pdf' | 'excel' | 'image' | 'csv' | 'json';
                      handleDownload(format);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Timetable
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    <Download className="h-4 w-4 mr-2" />
                    Print Timetable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
