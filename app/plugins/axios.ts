import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY3MDc1MTM4ODIzNzczNDgsIm1haWwiOiJzY2FwZXJvd0Bob3RtYWlsLmNvbSIsInNpZ2luQXMiOiJtYWlsIiwiaWF0IjoxNjcwNzU3OTI3fQ.ttdBleEnwVQ-fN6qmDyrMdrrE_iQwj0WTeJQxCkylEY";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      axios: axios.create(),
    },
  };
});
