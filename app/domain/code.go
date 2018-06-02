package domain

const (
	CodeAddressAvailable = iota + 1000
	CodeAddressTooShort
	CodeAddressExist
	CodeAddressNotFound
)

const (
	CodeSessionValid = iota + 1100
	CodeSessionAccountNotExist
	CodeSessionNotExist
	CodeSessionInvalidHash
	CodeSessionInvalidExpire
	CodeSessionUpdateFailure
)

const (
	CodeLinkUpdateSuccess = iota + 1200
	CodeLinkUpdateFailure
	CodeLinkCreateSuccess
	CodeLinkCreateFailure
)

const (
	CodeAuthUpdateSuccess = iota + 1300
	CodeAuthUpdateFailure
)

const (
	CodeCalenderGetSuccess = iota + 1400
	CodeCalenderGetFailure
	CodeCalenderGetTokenFailure
)

const (
	CodeAccountNotFound = iota + 1500
)

const (
	CodeCalenderReserveSuccess = iota + 1600
	CodeCalenderReserveTokenFailure
	CodeCalenderReserveInsertFailure
	CodeCalenderReserveFailure
)

const (
	ErrorUnknown = iota + 2000
	ErrorJsonMarshal
	ErrorTemplateExecute
	ErrorTemplateParse
	ErrorSessionDisConnect
	ErrorInvalidURI
	ErrorInvalidQuery
	ErrorInvalidMethod
)
