
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Download, Mail, Share2, MessageSquare } from "lucide-react";

export default function ShareTimetable() {
  const handleCopyLink = () => {
    toast.success("Link copied to clipboard!");
  };
  
  const handleSendEmail = () => {
    toast.success("Email sent successfully!");
  };
  
  const handleWhatsApp = () => {
    toast.success("Opening WhatsApp to share timetable!");
  };
  
  const handleDownload = () => {
    toast.success("Downloading timetable!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Share Timetable</h1>
        <p className="text-muted-foreground">
          Share timetables with teachers, students, and staff
        </p>
      </div>
      
      <Tabs defaultValue="link" className="space-y-4">
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
                <select className="w-full p-2 border rounded-md">
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    <option value="teacher-1">Dr. John Smith</option>
                    <option value="teacher-2">Prof. Jane Doe</option>
                    <option value="teacher-3">Dr. Robert Johnson</option>
                    <option value="teacher-4">Prof. Emily Williams</option>
                  </optgroup>
                  <optgroup label="Class Timetables">
                    <option value="class-1">Computer Science Year 1-A</option>
                    <option value="class-2">Computer Science Year 1-B</option>
                    <option value="class-3">Electrical Engineering Year 2-A</option>
                    <option value="class-4">Mechanical Engineering Year 2-B</option>
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">Shareable Link</Label>
                <div className="flex">
                  <Input 
                    id="link" 
                    value="https://acadsync.edu/share/timetable/master" 
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
                  <Button variant="outline" onClick={() => window.open('#', '_blank')}>
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
                <select className="w-full p-2 border rounded-md">
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    <option value="teacher-1">Dr. John Smith</option>
                    <option value="teacher-2">Prof. Jane Doe</option>
                    <option value="teacher-3">Dr. Robert Johnson</option>
                    <option value="teacher-4">Prof. Emily Williams</option>
                  </optgroup>
                  <optgroup label="Class Timetables">
                    <option value="class-1">Computer Science Year 1-A</option>
                    <option value="class-2">Computer Science Year 1-B</option>
                    <option value="class-3">Electrical Engineering Year 2-A</option>
                    <option value="class-4">Mechanical Engineering Year 2-B</option>
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address(es)</Label>
                <Input 
                  id="email" 
                  type="text"
                  placeholder="Enter email addresses separated by commas"
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
                  defaultValue="Your Timetable from ACADSYNC"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <textarea 
                  id="message" 
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  placeholder="Add a personal message to the email"
                ></textarea>
              </div>
              
              <Button className="w-full bg-acadsync-500 hover:bg-acadsync-700" onClick={handleSendEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
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
                <select className="w-full p-2 border rounded-md">
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    <option value="teacher-1">Dr. John Smith</option>
                    <option value="teacher-2">Prof. Jane Doe</option>
                    <option value="teacher-3">Dr. Robert Johnson</option>
                    <option value="teacher-4">Prof. Emily Williams</option>
                  </optgroup>
                  <optgroup label="Class Timetables">
                    <option value="class-1">Computer Science Year 1-A</option>
                    <option value="class-2">Computer Science Year 1-B</option>
                    <option value="class-3">Electrical Engineering Year 2-A</option>
                    <option value="class-4">Mechanical Engineering Year 2-B</option>
                  </optgroup>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">WhatsApp Message</Label>
                <textarea 
                  id="message" 
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  defaultValue="Here is your timetable from ACADSYNC. Click the link to view: https://acadsync.edu/share/timetable/master"
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
                <select className="w-full p-2 border rounded-md">
                  <option value="master">Master Timetable</option>
                  <optgroup label="Teacher Timetables">
                    <option value="teacher-1">Dr. John Smith</option>
                    <option value="teacher-2">Prof. Jane Doe</option>
                    <option value="teacher-3">Dr. Robert Johnson</option>
                    <option value="teacher-4">Prof. Emily Williams</option>
                  </optgroup>
                  <optgroup label="Class Timetables">
                    <option value="class-1">Computer Science Year 1-A</option>
                    <option value="class-2">Computer Science Year 1-B</option>
                    <option value="class-3">Electrical Engineering Year 2-A</option>
                    <option value="class-4">Mechanical Engineering Year 2-B</option>
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
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Download Options</Label>
                <div className="grid gap-2">
                  <Button className="w-full bg-acadsync-500 hover:bg-acadsync-700" onClick={handleDownload}>
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
