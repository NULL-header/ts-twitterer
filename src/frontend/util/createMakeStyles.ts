import { createUseStyles, Theming } from "react-jss";
import { CSSProperties } from "react";

type MassJSS<Styles, Props> = {
  [Key in keyof Styles]: Key extends keyof CSSProperties
    ? CSSProperties[Key] | ((props: Props) => CSSProperties[Key])
    : CSSProperties | MassJSS<Styles[Key], Props>;
};

type BranchArg<Styles, Props> = Props extends undefined
  ? () => Record<keyof Styles, string>
  : (arg: Props) => Record<keyof Styles, string>;

export const createMakeStyles = <
  UserTheming extends Theming<any> | undefined = undefined
>(
  theming?: UserTheming
) => <Props extends Record<string, any> | undefined = undefined>(
  _props?: Props
) => <Styles extends Record<string, any>>(
  styles: UserTheming extends undefined
    ? MassJSS<Styles, Props>
    :
        | MassJSS<Styles, Props>
        | ((
            theme: UserTheming extends Theming<infer Theme> ? Theme : never
          ) => MassJSS<Styles, Props>)
) => {
  return createUseStyles<UserTheming>(styles as any, { theming }) as BranchArg<
    Styles,
    Props
  >;
};
