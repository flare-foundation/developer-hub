package types

import "extension-scaffold/pkg/decoder"

// RegisterDecoders registers all type decoders for this extension.
// Extension developers: add new registrations here for each OPType/OPCommand.
func RegisterDecoders(r *decoder.Registry) {
	// SAY_HELLO message (JSON)
	r.Register(
		decoder.RegistryKey{OPType: "GREETING", OPCommand: "SAY_HELLO", Kind: decoder.KindMessage},
		decoder.NewJSONDecoder[SayHelloRequest](),
	)
	// SAY_HELLO result (JSON)
	r.Register(
		decoder.RegistryKey{OPType: "GREETING", OPCommand: "SAY_HELLO", Kind: decoder.KindResult},
		decoder.NewJSONDecoder[SayHelloResponse](),
	)
	// SAY_GOODBYE message (ABI-encoded)
	r.Register(
		decoder.RegistryKey{OPType: "GREETING", OPCommand: "SAY_GOODBYE", Kind: decoder.KindMessage},
		decoder.NewABIDecoder[SayGoodbyeRequest](SayGoodbyeMessageArg),
	)
	// SAY_GOODBYE result (JSON)
	r.Register(
		decoder.RegistryKey{OPType: "GREETING", OPCommand: "SAY_GOODBYE", Kind: decoder.KindResult},
		decoder.NewJSONDecoder[SayGoodbyeResponse](),
	)
}
