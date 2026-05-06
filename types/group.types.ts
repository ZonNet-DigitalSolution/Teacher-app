export interface Student {
  id: number;
  student_name: string;
  phone?: string;
  grade?: string;
  profile_picture?: string;
  status?: string;
}

export type GroupStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'rejected'
  | 'completed'
  | 'waiting_session_approval'
  | 'processed'
  | 'cancelled'
  | 'closed';

export interface Group {
  id: number;
  name: string;
  classes: string[];
  status: GroupStatus;
  package_name: string;
  time: string;
  student_count: number;
  students?: Student[];
  is_special: boolean;
  session_link?: string | null;
  join_link?: string | null;
  whatsapp_link?: string | null;
  link?: string | null;
  is_review?: boolean;
}

export interface Package {
  id: number;
  name: string;
}

export const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  active: 'فعالة',
  inactive: 'غير فعالة',
  pending: 'قيد المراجعة',
  waiting_session_approval: 'قيد المراجعة للمواعيد',
  processed: 'تمت الموافقة',
  rejected: 'مرفوضة',
  cancelled: 'ملغية',
  completed: 'مكتملة',
  closed: 'مغلقة',
};

export const GROUP_STATUS_COLORS: Record<GroupStatus, string> = {
  active: '#349E3E',
  inactive: '#6c757d',
  pending: '#E89B32',
  waiting_session_approval: '#E89B32',
  rejected: '#dc3545',
  completed: '#B8CFDC',
  closed: '#7E57C2',
  processed: '#007bff',
  cancelled: '#adb5bd',
};
