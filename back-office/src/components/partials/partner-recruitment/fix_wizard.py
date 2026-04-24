import re

with open("PartnerRecruitmentManagementContent.tsx", "r") as f:
    content = f.read()

# Replace selectedQuestionIds array accesses
content = content.replace("selectedQuestionIds.length < 5", "selectedExamQuestionIds.length < 5")
content = content.replace("Selected questions: {selectedQuestionIds.length} / minimum 5", "Selected questions: {selectedExamQuestionIds.length} exam questions (min 5) and {selectedInterviewQuestionIds.length} interview prompts")
content = content.replace('value: `${selectedQuestionIds.length} selected`', 'value: `${selectedExamQuestionIds.length} exam, ${selectedInterviewQuestionIds.length} interview`')
content = content.replace('<li>3. Exam stage contains {selectedQuestionIds.length} selected question(s)</li>', '<li>3. Exam stage contains {selectedExamQuestionIds.length} exam question(s) and {selectedInterviewQuestionIds.length} interview guideline(s)</li>')


# Rewrite the setup-exam section!
setup_exam_start = content.find('<section\n            id="setup-exam"')
setup_exam_end = content.find('<section\n            id="review"', setup_exam_start)

new_setup_exam = """<section
            id="setup-exam"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "setup-exam" && "hidden",
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Assessment Setup</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Configure video interview guidelines and exam questions. At least 5 exam questions are required.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                Minimum 5 Exam Questions
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[240px_minmax(0,1fr)]">
              <div className="space-y-2">
                <Label>Minimal Passing Threshold</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={passingThreshold}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                  onChange={(event) => setPassingThreshold(event.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Add questions manually from this screen. Existing question bank items are not loaded here.
              </div>
            </div>

            <div className="mt-8 mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-base font-semibold text-slate-900">1. Video Interview Guidelines</h3>
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prompt Title</Label>
                  <Input
                    value={interviewForm.question}
                    placeholder="e.g. Self Introduction"
                    onChange={(event) =>
                      setInterviewForm((current) => ({ ...current, question: event.target.value }))
                    }
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Duration (Seconds)</Label>
                  <Input
                    type="number"
                    min="30"
                    value={interviewForm.maxVideoDuration}
                    onChange={(event) =>
                      setInterviewForm((current) => ({ ...current, maxVideoDuration: event.target.value }))
                    }
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Video Interview Instructions</Label>
                  <Textarea
                    value={interviewForm.videoInstructions}
                    placeholder="Explain what the candidate should cover in the recorded response."
                    onChange={(event) =>
                      setInterviewForm((current) => ({ ...current, videoInstructions: event.target.value }))
                    }
                    className="min-h-28 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Button type="button" onClick={addInterviewQuestion} disabled={savingQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  {savingQuestion ? "Saving..." : "Add Interview Guideline"}
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-14">Use</TableHead>
                    <TableHead>Prompt Title</TableHead>
                    <TableHead>Max Duration</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.filter(q => q.type === "video_introduction").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                        No video interview guidelines added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.filter(q => q.type === "video_introduction").map((question) => {
                      const checked = selectedInterviewQuestionIds.includes(question.id)
                      return (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                setSelectedInterviewQuestionIds((current) => {
                                  if (value === true) return [...new Set([...current, question.id])]
                                  return current.filter((id) => id !== question.id)
                                })
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900">{question.question}</TableCell>
                          <TableCell>{question.maxVideoDuration ? `${question.maxVideoDuration}s` : "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                await deleteQuestion(question.id)
                                setQuestions((current) => current.filter((item) => item.id !== question.id))
                                setSelectedInterviewQuestionIds((current) => current.filter((id) => id !== question.id))
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-rose-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-10 mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-base font-semibold text-slate-900">2. Exam Questions</h3>
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 p-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={examForm.type}
                    onValueChange={(value) => setExamForm((current) => ({ ...current, type: value }))}
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 xl:col-span-2">
                  <Label>Question</Label>
                  <Input
                    value={examForm.question}
                    placeholder="Write the question shown to the candidate"
                    onChange={(event) => setExamForm((current) => ({ ...current, question: event.target.value }))}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </div>

                {examForm.type === "multiple_choice" ? (
                  <>
                    {[
                      { key: "optionA", label: "Option A", placeholder: "First choice" },
                      { key: "optionB", label: "Option B", placeholder: "Second choice" },
                      { key: "optionC", label: "Option C", placeholder: "Third choice" },
                      { key: "optionD", label: "Option D", placeholder: "Fourth choice" },
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label>{field.label}</Label>
                        <Input
                          value={examForm[field.key]}
                          placeholder={field.placeholder}
                          onChange={(event) => setExamForm((current) => ({ ...current, [field.key]: event.target.value }))}
                          className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select
                        value={examForm.correctAnswer}
                        onValueChange={(value) => setExamForm((current) => ({ ...current, correctAnswer: value }))}
                      >
                        <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Option A</SelectItem>
                          <SelectItem value="b">Option B</SelectItem>
                          <SelectItem value="c">Option C</SelectItem>
                          <SelectItem value="d">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 xl:col-span-2">
                    Essay questions will be reviewed manually. Set the score weight to control how much this question contributes to the final result.
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Value Weight</Label>
                  <Input
                    type="number"
                    min="1"
                    value={examForm.points}
                    onChange={(event) => setExamForm((current) => ({ ...current, points: event.target.value }))}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Button type="button" onClick={addExamQuestion} disabled={savingQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  {savingQuestion ? "Saving..." : "Add Exam Question"}
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-14">Use</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.filter(q => q.type !== "video_introduction").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        No exam questions added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.filter(q => q.type !== "video_introduction").map((question) => {
                      const checked = selectedExamQuestionIds.includes(question.id)
                      return (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                setSelectedExamQuestionIds((current) => {
                                  if (value === true) return [...new Set([...current, question.id])]
                                  return current.filter((id) => id !== question.id)
                                })
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900">{question.question}</TableCell>
                          <TableCell>{question.type}</TableCell>
                          <TableCell>{question.points}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                await deleteQuestion(question.id)
                                setQuestions((current) => current.filter((item) => item.id !== question.id))
                                setSelectedExamQuestionIds((current) => current.filter((id) => id !== question.id))
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-rose-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Selected: {selectedExamQuestionIds.length} exam questions (min 5) and {selectedInterviewQuestionIds.length} interview prompts
              </p>
              <Button type="button" onClick={saveExamStep} disabled={savingExamConfig}>
                {savingExamConfig ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </section>
          """

content = content[:setup_exam_start] + new_setup_exam + content[setup_exam_end:]

with open("PartnerRecruitmentManagementContent.tsx", "w") as f:
    f.write(content)

