import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FeedbackReminderDialogProps {
  open: boolean;
  onClose: () => void;
  onProceedLogout: () => void;
}

const FeedbackReminderDialog = ({ open, onClose, onProceedLogout }: FeedbackReminderDialogProps) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share Your Feedback First! 💬</AlertDialogTitle>
          <AlertDialogDescription>
            We'd love to hear your thoughts before you go! Your feedback helps us improve.
            Would you like to leave some feedback first?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onProceedLogout}>Skip & Logout</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onClose(); navigate('/feedback'); }}>
            Give Feedback
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FeedbackReminderDialog;
