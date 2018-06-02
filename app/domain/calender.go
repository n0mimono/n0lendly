package domain

type Calender struct {
	Events []CalenderEvent `json:"events"`
}

type CalenderEvent struct {
	Summary string `json:"summary"`
	Start   string `json:"start"`
	End     string `json:"end"`
}
