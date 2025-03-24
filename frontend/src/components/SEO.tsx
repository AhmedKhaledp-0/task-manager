import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "ToTasky - Task Manager",
  description = "Manage your tasks efficiently",
  image = "/og.png",
  twImage = "/tw.png",
  url = "https://task-managerdepi.vercel.app",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={url + image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={url + twImage} />
    </Helmet>
  );
};

export default SEO;
