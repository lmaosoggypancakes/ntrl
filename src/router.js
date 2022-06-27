import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./views/Home.vue"),
    children: [
      {
        path: "",
        name: "Analytics",
        component: () => import("./views/home/Analytics.vue"),
      },
      {
        path: "new",
        name: "New Park",
        component: () => import("./views/home/CreatePark.vue"),
      },
      {
        path: "edit/:id",
        name: "Edit Park",
        component: () => import("./views/home/EditPark.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/Login.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach((to, from) => {
  const isAuthorized = localStorage.getItem("__API_KEY");
  if (!isAuthorized && to.name !== "Login") return { name: "Login" };
});

export default router;
