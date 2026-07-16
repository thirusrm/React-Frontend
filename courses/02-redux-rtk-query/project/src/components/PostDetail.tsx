import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../api/apiSlice";

const PostDetail = () => {
  const { postId } = useParams();

  const id = postId ? Number(postId) : 1;

  const { data, isLoading, error } = useGetPostByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <p data-testid="post-detail-loading">Loading...</p>;
  }

  if (error) {
    return <p data-testid="post-detail-error">Something went wrong.</p>;
  }

  return (
    <div data-testid="post-detail">
      <h2>{data?.title}</h2>
      <p>{data?.body}</p>
    </div>
  );
};

export default PostDetail;
