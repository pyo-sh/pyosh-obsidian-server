import "@style/app.css";
import "@style/index.css";
import "@style/warning.css";
import "@style/footer.css";
import "@style/google.css";
import { setupGoogleLogin } from "@script/auth/login";
import { checkAndDisplayMessage } from "@script/common/message";
import { setupNavbar } from "@script/common/navbar";

setupNavbar();
setupGoogleLogin();
checkAndDisplayMessage();
