/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type StrategyVerifyCallback } from 'remix-auth';
import { OAuth2Profile, OAuth2Strategy, OAuth2StrategyVerifyParams } from 'remix-auth-oauth2';

export interface SSOStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: SSOScope[] | string;
  userAgent?: string;
  authorizationURL?: string;
  tokenURL?: string;
  userInfoURL?: string;
}

export type SSOScope = 'basic';

export interface SSOProfile extends OAuth2Profile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  type: string;
  thirdUsers: {
    provider: string;
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  }[];
  membership: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SSOExtraParams extends Record<string, string | number | null> {}

export const SSOStrategyDefaultName = 'sso';
export const SSOStrategyDefaultScope: SSOScope = 'basic';
export const SSOStrategyScopeSeperator = ' ';

export class SSOStrategy<User> extends OAuth2Strategy<User, SSOProfile, SSOExtraParams> {
  name = SSOStrategyDefaultName;

  // @ts-ignore
  private scope: SSOScope[];
  private userAgent: string;
  private userInfoURL: string;

  constructor(
    {
      clientID,
      clientSecret,
      callbackURL,
      userAgent,
      scope,
      authorizationURL = 'https://sso.willin.wang/authorize',
      tokenURL = 'https://sso.willin.wang/token',
      userInfoURL = 'https://sso.willin.wang/userinfo'
    }: SSOStrategyOptions,
    verify: StrategyVerifyCallback<User, OAuth2StrategyVerifyParams<SSOProfile, SSOExtraParams>>
  ) {
    super(
      {
        clientID,
        clientSecret,
        callbackURL,
        authorizationURL,
        tokenURL
      },
      verify
    );
    this.scope = this.getScope(scope);
    this.userInfoURL = userInfoURL;
    this.userAgent = userAgent ?? 'Remix Auth';
  }

  //Allow users the option to pass a scope string, or typed array
  private getScope(scope: SSOStrategyOptions['scope']) {
    if (!scope) {
      return [SSOStrategyDefaultScope];
    } else if (typeof scope === 'string') {
      return scope.split(SSOStrategyScopeSeperator) as SSOScope[];
    }

    return scope;
  }

  protected async userProfile(accessToken: string): Promise<SSOProfile> {
    const response = await fetch(this.userInfoURL, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const profile: SSOProfile = await response.json();
    return profile;
  }
}
