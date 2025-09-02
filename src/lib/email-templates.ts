
export type TemplateId = 
    | "claim-approval"
    | "password-reset"
    | "new-enquiry"
    | "user-otp"
    | "partner-otp"
    | "password-otp"
    | "report-confirmation";

export const emailTemplates: { id: TemplateId, name: string }[] = [
    { id: "claim-approval", name: "Claim Approval" },
    { id: "password-reset", name: "Password Reset" },
    { id: "new-enquiry", name: "New Enquiry Notification" },
    { id: "user-otp", name: "User Verification OTP" },
    { id: "partner-otp", name: "Partner Verification OTP" },
    { id: "password-otp", name: "Password Reset OTP" },
    { id: "report-confirmation", name: "Report Submission Confirmation" },
];

export const templateContents: Record<TemplateId, { subject: string, message: string }> = {
    "claim-approval": {
        subject: "Your claim for {{itemName}} has been approved!",
        message: "Hello {{name}},\n\nGood news! Your claim for the item \"{{itemName}}\" has been approved by the owner. You can now proceed to chat with them to arrange the pickup.\n\nThank you,\nThe FindItNow Team"
    },
    "password-reset": {
        subject: "Your FindItNow Password Reset Request",
        message: "Hello {{name}},\n\nWe received a request to reset your password. Please use the link below to proceed.\n\nIf you did not request this, you can safely ignore this email.\n\nThank you,\nThe FindItNow Team"
    },
    "new-enquiry": {
        subject: "New Enquiry for your item: {{itemName}}",
        message: "Hello {{name}},\n\nYou have received a new enquiry about your item \"{{itemName}}\". Please log in to your account to view the details and respond.\n\nThank you,\nThe FindItNow Team"
    },
     "report-confirmation": {
        subject: "Your {{itemType}} item report for \"{{itemName}}\" has been submitted.",
        message: "Hello,\n\nThis is a confirmation that your report for the following item has been submitted:\n\nItem Name: {{itemName}}\nCategory: {{category}}\nLocation: {{location}}\nDate: {{date}}\n\nYou can view your submission here: {{link}}\n\nThank you for using FindItNow."
    },
    "user-otp": {
        subject: "Your FindItNow Verification Code",
        message: "Hello,\n\nYour one-time password (OTP) for verifying your account is: {{otp}}\n\nThis code will expire in 10 minutes.\n\nThank you,\nThe FindItNow Team"
    },
    "partner-otp": {
        subject: "Your FindItNow Partner Verification Code",
        message: "Hello,\n\nYour one-time password (OTP) for verifying your partner account is: {{otp}}\n\nThis code will expire in 10 minutes.\n\nThank you,\nThe FindItNow Team"
    },
    "password-otp": {
        subject: "Your FindItNow Password Reset Code",
        message: "Hello,\n\nYour one-time password (OTP) for resetting your password is: {{otp}}\n\nIf you did not request this, please ignore this email.\n\nThank you,\nThe FindItNow Team"
    }
};
