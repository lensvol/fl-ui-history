// @ts-ignore
import querystring from "query-string";

import BaseService, { Either } from "services/BaseMonadicService";
import { ApiSharedContent } from "services/ProfileService";

import {
  JournalFilterByOption,
  JournalSortByOption,
  JournalTagColor,
  JournalTagEntry,
} from "types/journal";

export type JournalPageRequest = {
  page?: number;
  date?: string;
  sortBy?: JournalSortByOption;
  filterBy?: JournalFilterByOption;
  fromId?: number;
  characterName?: string;
};

export type JournalPageResponse = {
  shares: ApiSharedContent[];
  page: number;
  pageCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type JournalFavoriteRequest = {
  page?: number;
  date?: string;
  sortBy?: JournalSortByOption;
  filterBy?: JournalFilterByOption;
  fromId?: number;
  characterName?: string;
};

export type JournalFavoriteResponse = {
  shares: ApiSharedContent[];
  page: number;
  pageCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type CreateJournalTagResponse = JournalTagEntry;

export type FetchJournalTagResponse = {
  tags: JournalTagEntry[];
};

export type UpdateJournalTagRequest = {
  id: number;
  name?: string;
  color?: JournalTagColor;
  isFavorite?: boolean;
};

export type AttachJournalTagRequest = {
  tagId: number;
  entryId: number;
};

export type DeleteJournalEntryRequest = {
  entryId: number;
  page: number;
};

export type DetachJournalTagRequest = AttachJournalTagRequest;

export type UpdateJournalTagResponse = FetchJournalTagResponse;

export type DeleteJournalTagResponse = {
  tags: JournalTagEntry[];
  tagId: number;
};

export type AttachJournalTagResponse = {
  tags: JournalTagEntry[];
  entryId: number;
};

export type DetachJournalTagResponse = AttachJournalTagResponse;

export type UpdateDescriptionResponse = {
  message: string;
};

export type DeleteJournalEntryResponse = JournalPageResponse;

export interface IJournalService {
  fetchJournalPage: (
    request: JournalPageRequest
  ) => Promise<Either<JournalPageResponse>>;

  fetchJournalFavorite: (
    request: JournalFavoriteRequest
  ) => Promise<Either<JournalFavoriteResponse>>;

  createJournalTag: (
    tagName: string
  ) => Promise<Either<CreateJournalTagResponse>>;

  fetchJournalTags: () => Promise<Either<FetchJournalTagResponse>>;

  updateJournalTag: (
    request: UpdateJournalTagRequest
  ) => Promise<Either<FetchJournalTagResponse>>;

  deleteJournalTag: (tagId: number) => Promise<Either<FetchJournalTagResponse>>;

  attachJournalTag: (
    request: AttachJournalTagRequest
  ) => Promise<Either<FetchJournalTagResponse>>;

  detachJournalTag: (
    request: DetachJournalTagRequest
  ) => Promise<Either<FetchJournalTagResponse>>;

  deleteJournalEntry: (
    request: DeleteJournalEntryRequest
  ) => Promise<Either<DeleteJournalEntryResponse>>;
}

export default class JournalService
  extends BaseService
  implements IJournalService
{
  fetchJournalPage = (request: JournalPageRequest) => {
    const qs = querystring.stringify({
      page: request.page,
      date: request.date,
      sortBy: request.sortBy?.value,
      filterBy: request.filterBy?.value,
      fromId: request.fromId,
      characterName: request.characterName,
    });

    const config = {
      method: "get",
      url: `/journal?${qs}`,
    };

    return this.doRequest<JournalPageResponse>(config);
  };

  fetchJournalFavorite = (request: JournalFavoriteRequest) => {
    const qs = querystring.stringify({
      page: request.page,
      date: request.date,
      sortBy: request.sortBy?.value,
      filterBy: request.filterBy?.value,
      fromId: request.fromId,
      characterName: request.characterName,
    });

    const config = {
      method: "get",
      url: `/journal/favorite?${qs}`,
    };

    return this.doRequest<JournalFavoriteResponse>(config);
  };

  createJournalTag = (tagName: string) => {
    const config = {
      method: "post",
      url: "/journal/tag/create",
      data: {
        name: tagName,
      },
    };

    return this.doRequest<CreateJournalTagResponse>(config);
  };

  fetchJournalTags = () => {
    const config = {
      method: "get",
      url: "/journal/tag",
    };

    return this.doRequest<FetchJournalTagResponse>(config);
  };

  updateJournalTag = (request: UpdateJournalTagRequest) => {
    const config = {
      method: "post",
      url: "/journal/tag",
      data: request,
    };

    return this.doRequest<FetchJournalTagResponse>(config);
  };

  deleteJournalTag = (tagId: number) => {
    const config = {
      method: "post",
      url: "/journal/tag/delete",
      data: tagId,
    };

    return this.doRequest<FetchJournalTagResponse>(config);
  };

  attachJournalTag = (request: AttachJournalTagRequest) => {
    const config = {
      method: "post",
      url: "/journal/tag/attach",
      data: request,
    };

    return this.doRequest<FetchJournalTagResponse>(config);
  };

  detachJournalTag = (request: DetachJournalTagRequest) => {
    const config = {
      method: "post",
      url: "/journal/tag/detach",
      data: request,
    };

    return this.doRequest<FetchJournalTagResponse>(config);
  };

  deleteJournalEntry = (request: DeleteJournalEntryRequest) => {
    const config = {
      method: "post",
      url: "/journal/delete",
      data: request,
    };

    return this.doRequest<DeleteJournalEntryResponse>(config);
  };
}
