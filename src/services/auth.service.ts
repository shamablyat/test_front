import { useAppUrl } from "@/composables/useAppUrl";
import { UserManager, WebStorageStateStore } from "oidc-client";

const { STS_DOMAIN } = useAppUrl();

export default class AuthService {
  private userManager: UserManager;

  constructor() {
    const CURRENT_URL: string = window.location.origin;
    const settings: any = {
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: STS_DOMAIN.value,
      client_id: "ihma_eld_web",
      redirect_uri: `${CURRENT_URL}/callback.html`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${CURRENT_URL}/silent-renew.html`,
      response_type: "code",
      scope: "openid profile ihma_eld_api ihma_ins_api ihma_sxv_api ihma_adm_api IdentityServerApi ",
      post_logout_redirect_uri: `${CURRENT_URL}/`,
      filterProtocolClaims: true,
      revokeAccessTokenOnSignout: true
    };
    this.userManager = new UserManager(settings);
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  public getAccessToken(): Promise<string> {
    return this.userManager.getUser().then((data: any) => {
      return data?.access_token;
    });
  }
}
