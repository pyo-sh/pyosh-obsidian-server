export const getToken = async () => {
  const res = await fetch("/api/token", {
    method: "GET",
    credentials: "same-origin",
  });

  const data = await res.json();

  if (!res.ok && !data.error) {
    window.location.href = "/?message=server_error";
  }

  if (!res.ok) {
    window.location.href = `/?message=${data.error}`;
  }

  return data;
};

export const destroyToken = () => {
  return fetch("/api/token/destroy", {
    method: "POST",
    credentials: "same-origin",
  });
};
