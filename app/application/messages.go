package app

import "n0lendly/app/domain"

func getErrorNameAndMessage(code int) (string, string) {
	switch code {
	case domain.ErrorUnknown:
		return "Unknown", "Unknown error."
	case domain.ErrorJsonMarshal:
		return "Json", "Json encoding error."
	case domain.ErrorTemplateExecute:
		return "Template", "Template execute error."
	case domain.ErrorTemplateParse:
		return "Template", "Template parse error."
	case domain.ErrorSessionDisConnect:
		return "Session", "Session disconnected."
	case domain.ErrorInvalidURI:
		return "Request", "Invalid URI."
	case domain.ErrorInvalidQuery:
		return "Request", "Invalid query."
	case domain.ErrorInvalidMethod:
		return "Request", "Invalid method."
	default:
		return "Unknown", "Unknown error."
	}
}
