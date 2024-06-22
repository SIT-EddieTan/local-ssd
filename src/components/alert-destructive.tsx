import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";

interface AlertDestructiveProps {
    title?: string;
    description?: string | React.JSX.Element;
    className?: string;
    actionText?: string;
    onActionClick?: () => void;
}

export function AlertDestructive({
    title,
    description,
    className,
    actionText,
    onActionClick
}: AlertDestructiveProps) {
    if (!title) return null;
    return (
        <Alert variant="destructive" className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
                {actionText && onActionClick && (
                    <p>
                        <a href="#" onClick={(e) => { e.preventDefault(); onActionClick(); }} className="text-blue-600 underline">
                            {actionText}
                        </a>
                    </p>
                )}
            </AlertDescription>
        </Alert>
    );
}