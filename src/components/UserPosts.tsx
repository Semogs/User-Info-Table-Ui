import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import userService from "../services/UserService";
import { Post } from "./Interface";
import { PAGE_SIZE } from "../config";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "../css/userPosts.css";
import ContentLoader from "./ContentLoader";

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    async function fetchPosts(): Promise<void> {
      setLoading(true);
      if (userId) {
        const parsedUserId = parseInt(userId);
        const res = await userService.getUserPosts(parsedUserId);
        if (Array.isArray(res)) {
          setPosts(res);
          setLoading(false);
        }
      }
    }

    fetchPosts();
  }, [userId]);

  const handleDeletePost = async (postId: number) => {
    await userService.deletePost(postId);
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value);

  const handleNextPage = () => setCurrentPage(currentPage + 1);

  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const filteredPosts = useMemo(() => posts.filter((post) => post.title.toLowerCase().includes(filter.toLowerCase())), [posts, filter]);

  const postsToShow = useMemo(
    () => filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredPosts, currentPage]
  );

  return (
    <div className="page-con-user-posts">
      {loading ? (
        <ContentLoader />
      ) : (
        <div className="user-posts">
          <div className="user-posts-top-con">
            <TextField className="user-posts-filter" placeholder="Filter posts" value={filter} onChange={handleFilterChange} />
            <Button className="user-posts-back-button" component={Link} to="/" variant="contained">
              Back to Users
            </Button>
          </div>
          <div className="user-posts-wrapper">
            {!postsToShow.length && <h2 className="user-posts-no-posts">No post found</h2>}
            {postsToShow.map((post) => (
              <article key={post.id} className="user-posts-post">
                <IconButton onClick={() => handleDeletePost(post.id)} className="user-post-delete-btn">
                  <DeleteIcon />
                </IconButton>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </article>
            ))}
          </div>
          <div className="user-posts-btn-con">
            <IconButton className="user-posts-button user-posts-button-prev" onClick={handlePrevPage} disabled={currentPage === 1}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              className="user-posts-button user-posts-button-next"
              onClick={handleNextPage}
              disabled={filteredPosts.length / PAGE_SIZE <= currentPage}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
