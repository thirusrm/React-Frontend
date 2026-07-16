import {createApi,fakeBaseQuery,} from "@reduxjs/toolkit/query/react";
import { mockApi } from "./mockServer";
export interface User {id: number;name: string;username: string;email: string;}
export interface Post {id: number;title: string;body: string;}
export const apiSlice = createApi({reducerPath: "api",baseQuery: fakeBaseQuery(),tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {const users = await mockApi.getUsers();return { data: users };}
        catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",},};}},
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const posts = await mockApi.getPosts();
          return { data: posts };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        try {
          const post = await mockApi.getPostById(id);
          return {
            data: post,
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            },
          };
        }
      },

      providesTags: (result, error, id) => [
        {
          type: "Post",
          id,
        },
      ],
    }),
    addPost: builder.mutation<Post, Omit<Post, "id">>({
      queryFn: async (newPost) => {
        try {
          const post = await mockApi.addPost(newPost);
          return {
            data: post,
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            },
          };
        }
      },
      invalidatesTags: [{ type: "Post", id: "LIST" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              draft.push({
                id: Date.now(),
                ...arg,
              } as Post);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});
export const {useGetUsersQuery,useGetPostsQuery,useGetPostByIdQuery,useAddPostMutation,} = apiSlice;