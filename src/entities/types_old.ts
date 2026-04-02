// import { ApiResponse } from '@ktsstudio/mediaproject-utils';
// import FormFieldModel from 'store/models/FormFieldModel';

// export type ApiHeroType = {
//   last_name: string;
//   death_date: string;
//   user_photo: UploadImageResponse | null;
//   is_deleted: boolean;
//   is_alive: boolean;
//   birthday_date: string;
//   patronyc_name: string;
//   user_id: string;
//   photo: UploadImageResponse | null;
//   status: ApiHeroFormStatusEnum;
//   id: string;
//   first_name: string;
//   procession_id: string;
//   broadcast_url: string | null;
//   reasons: ApiDeclineReasonType<ApiHeroFieldsEnum>[] | null;
//   story_reasons: ApiDeclineReasonType<ApiStoryFieldsEnum>[] | null;
//   story_status: ApiHeroFormStatusEnum | null;
// };

// export type ApiHeroesList = ApiHeroType[];

// export type ApiHeroesListResponse = ApiResponse<{
//   heroes: ApiHeroesList;
//   can_create_hero: boolean;
//   unread_notifications: boolean;
// }>;

// export enum ApiHeroFormStatusEnum {
//   forUpload = 'for_upload',
//   moderating = 'moderating',
//   moderationBlock = 'moderation_block',
//   rejected = 'rejected',
//   approved = 'approved',
// }

// export enum FormStatusEnum {
//   pending = 'pending',
//   pendingBlock = 'pendingBlock', // редактирование запрещено
//   accepted = 'accepted',
//   rejected = 'rejected',
// }

// export const mapFormStatus: Record<ApiHeroFormStatusEnum, FormStatusEnum> = {
//   [ApiHeroFormStatusEnum.forUpload]: FormStatusEnum.pending,
//   [ApiHeroFormStatusEnum.moderating]: FormStatusEnum.pending,
//   [ApiHeroFormStatusEnum.moderationBlock]: FormStatusEnum.pendingBlock,
//   [ApiHeroFormStatusEnum.approved]: FormStatusEnum.accepted,
//   [ApiHeroFormStatusEnum.rejected]: FormStatusEnum.rejected,
// };

// export type ApiHeroStoryType = {
//   id: string;
//   theme: ApiTopicsEnum;
//   title: string;
//   text: string;
//   photos: UploadImageResponse[];
//   status: ApiHeroFormStatusEnum | null;
//   reasons: ApiDeclineReasonType<ApiStoryFieldsEnum>[] | null;
// };

// export type ApiHeroResponse = {
//   hero: ApiHeroType;
//   story: ApiHeroStoryType | null;
// };

// export type ImageInitType = {
//   id: number | null;
//   url: string;
// };

// export type FormInitType = {
//   firstName: string;
//   lastName: string;
//   middleName: string;
//   photo: ImageInitType | null;
//   photoVeteran: ImageInitType | null;
//   birthday: string;
//   deathDay: string;
//   alive: boolean;
//   status: FormStatusEnum;
//   storyStatus: FormStatusEnum | null;
//   broadcastUrl: string;
//   storyTopic: number | null;
//   storyTitle: string;
//   story: string;
//   storyPhotos: ImageInitType[];
//   problems: ApiDeclineReasonType<ApiHeroFieldsEnum>[] | null;
//   storyProblems: ApiDeclineReasonType<ApiStoryFieldsEnum>[] | null;
// };

// export type HeroesListType = {
//   heroesEntities: Record<string, any>; // чтобы избавиться от циклических импортов, на самом деле тут Form вместо any
//   heroesIDs: string[];
//   // atLeastOneAccepted: boolean;
// };

// export type HeroPreviewStatusType<T> = {
//   status: FormStatusEnum;
//   problems?: T[];
// };

// export type HeroPreviewType = {
//   id: string;
//   fullName: string;
//   photo: string;
//   statuses: {
//     participation: HeroPreviewStatusType<HeroProblemType>;
//     story: HeroPreviewStatusType<StoryProblemType>;
//   };
//   broadcastUrl: string | null;
// };

// export const DefaultForm: FormInitType = {
//   firstName: '',
//   lastName: '',
//   middleName: '',
//   photo: null,
//   photoVeteran: null,
//   birthday: '',
//   deathDay: '',
//   alive: false,
//   status: FormStatusEnum.pending,
//   storyStatus: FormStatusEnum.pending,
//   broadcastUrl: '',
//   storyTopic: null,
//   storyTitle: '',
//   story: '',
//   storyPhotos: [],
//   problems: null,
//   storyProblems: null,
// };

// export type ApiHeroSendData = {
//   first_name: string;
//   last_name: string;
//   patronyc_name?: string;
//   birthday_date?: string;
//   death_date?: string;
//   is_alive?: boolean;
//   photo?: number; // фото ветерана
//   user_photo?: number; // фото пользователя
// };

// export type ScrollCallbackType = (field: string) => void;

// export type UploadImageResponse = {
//   id: number;
//   small_url: string;
//   medium_url: string;
//   big_url: string;
// };

// export type ImageFormField = FormFieldModel<string, { id?: number; type?: PhotoType }>;

// export enum ApiPhotoType {
//   hero = 'hero',
//   story = 'story',
//   snippet = 'snippet',
// }

// export const photoTypesMap: Record<PhotoType, ApiPhotoType> = {
//   [PhotoType.photo]: ApiPhotoType.hero,
//   [PhotoType.veteran]: ApiPhotoType.hero,
//   [PhotoType.storyPhoto]: ApiPhotoType.story,
// };

// export enum ApiTopicsEnum {
//   letter = 'letter',
//   feat = 'feat',
//   love = 'love',
//   memories = 'memories',
//   postwar = 'postwar',
// }

// export const topicsMap: ApiTopicsEnum[] = [
//   ApiTopicsEnum.letter,
//   ApiTopicsEnum.feat,
//   ApiTopicsEnum.love,
//   ApiTopicsEnum.memories,
//   ApiTopicsEnum.postwar,
// ];

// export type ApiStorySendData = {
//   theme?: ApiTopicsEnum;
//   title?: string;
//   text?: string;
//   photos?: number[];
// };

// export type ApiHeroSendType = {
//   hero: ApiHeroSendData;
//   story?: ApiStorySendData;
// };

// export type BuffImagesType = {
//   photo: string;
//   photoVeteran: string;
//   storyPhotos: string[];
// };

// export type ApiDeclineReasonType<T> = {
//   name?: string;
//   description: string;
//   fields?: T[];
// };

// export enum ApiHeroFieldsEnum {
//   first_name = 'first_name',
//   last_name = 'last_name',
//   patronyc_name = 'patronyc_name',
//   user_photo = 'user_photo',
//   photo = 'photo',
//   birthday_date = 'birthday_date',
//   death_date = 'death_date',
// }

// export enum HeroFieldsEnum {
//   firstName = 'firstName',
//   lastName = 'lastName',
//   middleName = 'middleName',
//   photo = 'photo',
//   photoVeteran = 'photoVeteran',
//   birthday = 'birthday',
//   deathDay = 'deathDate',
// }

// export const ApiToFrontHeroFields: Record<ApiHeroFieldsEnum, HeroFieldsEnum> = {
//   [ApiHeroFieldsEnum.first_name]: HeroFieldsEnum.firstName,
//   [ApiHeroFieldsEnum.last_name]: HeroFieldsEnum.lastName,
//   [ApiHeroFieldsEnum.patronyc_name]: HeroFieldsEnum.middleName,
//   [ApiHeroFieldsEnum.photo]: HeroFieldsEnum.photoVeteran,
//   [ApiHeroFieldsEnum.user_photo]: HeroFieldsEnum.photo,
//   [ApiHeroFieldsEnum.birthday_date]: HeroFieldsEnum.birthday,
//   [ApiHeroFieldsEnum.death_date]: HeroFieldsEnum.deathDay,
// };

// export enum ApiStoryFieldsEnum {
//   title = 'title',
//   theme = 'theme',
//   photos = 'photos',
//   text = 'text',
// }

// export enum StoryFieldsEnum {
//   storyTitle = 'storyTitle',
//   storyTopic = 'storyTopic',
//   storyPhotos = 'storyPhotos',
//   story = 'story',
// }

// export const ApiToFrontStoryFields: Record<ApiStoryFieldsEnum, StoryFieldsEnum> = {
//   [ApiStoryFieldsEnum.title]: StoryFieldsEnum.storyTitle,
//   [ApiStoryFieldsEnum.theme]: StoryFieldsEnum.storyTopic,
//   [ApiStoryFieldsEnum.photos]: StoryFieldsEnum.storyPhotos,
//   [ApiStoryFieldsEnum.text]: StoryFieldsEnum.story,
// };

// export type ProblemType<T> = {
//   name: string;
//   description: string;
//   field: T;
// };

// export type HeroProblemType = ProblemType<HeroFieldsEnum>;

// export type StoryProblemType = ProblemType<StoryFieldsEnum>;
