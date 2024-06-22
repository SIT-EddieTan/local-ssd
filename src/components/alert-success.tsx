import { CheckCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AlertSuccessProps {
    title?: string,
    description?: string,
    className?: string,
}

export function AlertSuccess({ title, description, className }: AlertSuccessProps) {
    if (!title) return null
    return (
        <Alert className={"bg-green-50 border-green-500 text-green-700 " + className}>
            <CheckCircleIcon className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}
