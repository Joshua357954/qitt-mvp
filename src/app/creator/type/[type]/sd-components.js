import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CalendarDays,
  FileText,
  BookOpen,
  Megaphone,
  ExternalLink,
  Notebook,
  Clock,
  Pencil,
  Trash2,
  AlertCircle,
  ArrowLeft,
  User,
} from "lucide-react";
import Link from "next/link";
import { CONTENT_TYPES } from "./data";
import { fbTime } from "@/utils/utils";

// Common Components
export const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

export const EmptyState = ({ activeType }) => (
  <Card className="border-dashed mx-auto">
    <CardContent className="p-8 text-center">
      <p className="text-gray-500">No {activeType} available</p>
      <Button className="mt-4 bg-blue-800" asChild>
        <Link href={`/creator/${activeType}/`}>
          <Plus className="h-4 w-4 mr-2" />
          Create your first {activeType.endsWith("s") ? activeType.slice(0, -1) : activeType}
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export const ContentHeader = () => (
  <div className="flex gap-5 items-center p-5 border-b bg-white shadow-sm">
    <Link href="/creator" className="hover:bg-gray-100 p-2 rounded-full">
      <ArrowLeft size={20} />
    </Link>
    <h1 className="text-2xl font-bold">Creator Dashboard</h1>
  </div>
);

export const ContentTabs = ({ activeType, setActiveType }) => (
  <div className="flex overflow-x-auto pb-2 gap-2">
    {CONTENT_TYPES.map((type) => (
      <Button
        key={type.id}
        variant={activeType === type.id ? "default" : "outline"}
        onClick={() => setActiveType(type.id)}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        {type.icon}
        {type.name}
      </Button>
    ))}
  </div>
);

const ItemActions = ({ type, id, onDelete }) => (
  <div className="flex gap-1">
    <Button variant="ghost" size="sm" asChild>
      <Link href={`/creator/${type}?editId=${id}`}>
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDelete(type, id)}
      className="hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
  </div>
);

const ItemFooter = ({ date, label = "Posted" }) => (
  <CardFooter className="text-xs text-gray-500 flex items-center">
    <CalendarDays className="h-3 w-3 mr-1" />
    {label}: {new Date(date).toLocaleDateString()}
  </CardFooter>
);

// Content Cards
export const AssignmentCard = ({ item, onDelete }) => (
  <Card className="border-l-4 border-blue-500 hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {item.title}
        </CardTitle>
        <ItemActions type="assignments" id={item.id} onDelete={onDelete} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
      <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md w-fit">
        <AlertCircle className="h-4 w-4" />
        Due: {new Date(item.dueDate).toLocaleDateString()}
      </div>
    </CardContent>
    <ItemFooter date={item.createdAt} />
  </Card>
);

export const AnnouncementCard = ({ item, onDelete }) => (
  <Card className="border-l-4 border-orange-500 hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-orange-600" />
          {item.title}
        </CardTitle>
        <ItemActions type="announcements" id={item.id} onDelete={onDelete} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{item.message}</p>
    </CardContent>
    <ItemFooter date={fbTime(item.updatedAt)} />
  </Card>
);

export const CourseCard = ({ item, onDelete }) => (
  <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {item.code} &nbsp; - &nbsp; {item.title}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-blue-600" />
            {item.creditUnit} Credit Unit{item.creditUnit > 1 ? 's' : ''}
          </p>
        </div>
        <ItemActions type="courses" id={item.id} onDelete={onDelete} />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {item.description || 'Course description not available'}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center">
          <User className="h-3 w-3 mr-1" />
          {item.lecturers || 'Lecturer info pending'}
        </span>
      </div>
    </CardContent>
  </Card>
);

export const ResourceCard = ({ item, onDelete }) => (
  <Card className="border-l-4 border-purple-500 hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-purple-600" />
          {item.title}
        </CardTitle>
        <ItemActions type="resources" id={item.id} onDelete={onDelete} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
      <Button variant="outline" className="w-full" asChild>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Resource
        </a>
      </Button>
    </CardContent>
    <ItemFooter date={item.createdAt} />
  </Card>
);

export const NoteCard = ({ item, onDelete }) => (
  <Card className="border-l-4 border-amber-500 hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle className="flex items-center gap-2">
          <Notebook className="h-5 w-5 text-amber-600" />
          {item.title}
        </CardTitle>
        <ItemActions type="notes" id={item.id} onDelete={onDelete} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.content}</p>
      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </CardContent>
    <ItemFooter date={item.updatedAt} label="Last updated" />
  </Card>
);

export const TimetableCard = ({ item, onDelete }) => (
  <Card className="border-l-4 border-red-500 hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle className="flex items-center gap-2 capitalize">
          <Clock className="h-5 w-5 text-red-600" />
          {item.departmentId.split('_').join(' ')} - <span className="uppercase">{item.spaceId}</span>
        </CardTitle>
        <ItemActions type="timetable" id={item.id} onDelete={onDelete} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-500">Date Posted</p>
          <p className="font-medium">
            {new Date(fbTime(item.createdAt)).toLocaleDateString()} 
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-500">Posted By</p>
          <p className="font-medium capitalize">{item.postedBy.name}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500"></p>
          <p className="font-medium capitalize">{item.type}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500"></p>
          <p className="font-medium">{item.instructor}</p>
        </div>
      </div>
    </CardContent>
    <ItemFooter date={fbTime(item.updatedAt)} label="Updated" />
  </Card>
);
