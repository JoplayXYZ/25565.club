import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const maintenance = import.meta.env.ENABLE_MAINTENANCE === true || import.meta.env.ENABLE_MAINTENANCE === "true";
  const path = context.url.pathname;

  if (maintenance && path !== "/maintenance") {
    return context.redirect("/maintenance");
  }

  return next();
});
