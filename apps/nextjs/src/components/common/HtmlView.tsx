import { Prose, type ProseProps } from "@nikolovlazar/chakra-ui-prose"

type Props = {
  value: string | null
} & ProseProps
export const HtmlView = ({ value, ...rest }: Props) =>
  <Prose {...rest}>
    {value !== null
      ? <div dangerouslySetInnerHTML={{ __html: value as string | TrustedHTML }} />
      : null}
  </Prose>