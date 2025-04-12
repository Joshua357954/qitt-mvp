"use client";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, NotebookPen, MessageSquare } from "lucide-react";

const MorePage = () => {
  const features = [
    {
      name: "Privacy Policy",
      icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
      link: "/more/privacy-policy",
    },
    {
      name: "Apply for Creator",
      icon: <NotebookPen className="h-5 w-5 text-purple-500" />,
      link: "/creator/apply",
    },
    {
      name: "Help Center",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      link: "/more/help",
    },
  ];

  return (
    <MainLayout route="More">
      <Card className="mx-auto w-3/4 sm:w-1/2 border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          {/* <CardTitle className="text-center text-xl">More Options</CardTitle> */}
        </CardHeader>
        <CardContent className="grid gap-7 px-0">
          {features.map((feature, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-14 justify-start gap-4 px-6 py-4 hover:bg-gray-100/50 transition-colors"
              asChild
            >
              <a href={feature.link}>
                {feature.icon}
                <span className="text-sm font-medium">{feature.name}</span>
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default MorePage;
