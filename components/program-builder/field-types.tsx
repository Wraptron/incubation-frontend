import type { ReactNode } from "react";
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  CircleDot,
  File,
  Image as ImageIcon,
  List,
  Mail,
  Phone,
  Type,
} from "lucide-react";
import type { FieldType } from "@/lib/program-forms/types";

export type FieldTypeCategory = "input" | "choice" | "media";

export const FIELD_TYPE_CATEGORIES: Array<{
  id: FieldTypeCategory;
  label: string;
}> = [
  { id: "input", label: "Text & contact" },
  { id: "choice", label: "Choices" },
  { id: "media", label: "Uploads & date" },
];

export const FIELD_TYPES: Array<{
  value: FieldType;
  label: string;
  description: string;
  category: FieldTypeCategory;
  icon: ReactNode;
}> = [
  {
    value: "text",
    label: "Text",
    description: "Single line answer",
    category: "input",
    icon: <Type className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "textarea",
    label: "Textarea",
    description: "Long form answer",
    category: "input",
    icon: <AlignLeft className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "email",
    label: "Email",
    description: "Email address",
    category: "input",
    icon: <Mail className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "phone",
    label: "Phone",
    description: "Phone number",
    category: "input",
    icon: <Phone className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "radio",
    label: "Radio",
    description: "Pick one option",
    category: "choice",
    icon: <CircleDot className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "select",
    label: "Select",
    description: "Dropdown choice",
    category: "choice",
    icon: <List className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "multi_select",
    label: "Multi Select",
    description: "Pick multiple options",
    category: "choice",
    icon: <CheckSquare className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "image",
    label: "Image",
    description: "Upload an image",
    category: "media",
    icon: <ImageIcon className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "file",
    label: "File",
    description: "Upload a document",
    category: "media",
    icon: <File className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    value: "date",
    label: "Date",
    description: "Pick a date",
    category: "media",
    icon: <Calendar className="h-4 w-4" strokeWidth={1.75} />,
  },
];
