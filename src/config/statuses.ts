// status = [ UNDER_REVIEW, REJECTED, APPROVED ]
export enum StatusEnum {
  UNDER_REVIEW = 'UNDER_REVIEW',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export const heroStatuses: Record<StatusEnum, { id: StatusEnum; title: string }> = {
  [StatusEnum.UNDER_REVIEW]: {
    id: StatusEnum.UNDER_REVIEW,
    title: 'На модерации',
  },
  [StatusEnum.REJECTED]: {
    id: StatusEnum.REJECTED,
    title: 'Отклонён',
  },
  [StatusEnum.APPROVED]: {
    id: StatusEnum.APPROVED,
    title: 'Участвует в шествии',
  },
};
