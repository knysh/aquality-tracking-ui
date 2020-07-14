export class QualificationQuestion {
    id?: number;
    question_status_id?: number;
    created_date?: Date;
    category_id?: number;
    min_qualification_id?: number;
    max_qualification_id?: number;
    question?: string;
    answer?: string;
    creator_id?: number;
    approver_id?: number;
}
