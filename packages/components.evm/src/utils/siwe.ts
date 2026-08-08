export interface SiweMessageParams {
  domain: string
  address: string
  uri: string
  version?: string
  chainId: number
  nonce: string
  issuedAt?: string
  expirationTime?: string
  notBefore?: string
  requestId?: string
  statement?: string
  resources?: string[]
}

export function createSiweMessage(params: SiweMessageParams): string {
  const {
    domain,
    address,
    uri,
    version = '1',
    chainId,
    nonce,
    issuedAt = new Date().toISOString(),
    expirationTime,
    notBefore,
    requestId,
    statement,
    resources,
  } = params

  // EIP-4361 ABNF: `address LF, LF, [statement LF], LF, "URI:"…`. The blank
  // line separating the (optional) statement block from the URI field is
  // always present — so an omitted statement still leaves two blank lines
  // between the address and `URI:`. Emitting only one produces a non-canonical
  // message that strict on-device parsers (e.g. Ledger's clear-signing) reject.
  const lines: string[] = [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
  ]

  if (statement) {
    lines.push(statement)
  }
  lines.push('')

  lines.push(
    `URI: ${uri}`,
    `Version: ${version}`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  )

  if (expirationTime) {
    lines.push(`Expiration Time: ${expirationTime}`)
  }

  if (notBefore) {
    lines.push(`Not Before: ${notBefore}`)
  }

  if (requestId) {
    lines.push(`Request ID: ${requestId}`)
  }

  if (resources?.length) {
    lines.push('Resources:')
    for (const resource of resources) {
      lines.push(`- ${resource}`)
    }
  }

  return lines.join('\n')
}
