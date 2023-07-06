import CircularProgress from "@mui/material/CircularProgress";

const ContentLoader = () => (
  <div className="loader-wrapper">
    <div className="loader-style">
      <CircularProgress size={100} thickness={1.5} />
    </div>
  </div>
);

export default ContentLoader;
