const apiUrlEndpoint: string = "http://localhost:9777/";
export const PAGE_SIZE: number = 4;

const endpoints: { [key: string]: string } = {
  getUsersEndpoint: apiUrlEndpoint + "users",
  getUserPostsEndpoint: apiUrlEndpoint + "posts"
};

export default endpoints;
