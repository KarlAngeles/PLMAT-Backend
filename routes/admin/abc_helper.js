const { Question } = require('../../models/questions')

let questionBank = []
let questionBankTotal;
let questionSetQuantity; // Number of questionnaires to produce
let questionnaireItemQuantity; // Number of questions per questionnaire
let start = process.hrtime() 

// Helper function for benchmarking
const timeHelper = () => {
  const precision = 3
  const seconds = process.hrtime(start)[0]
  const ms = process.hrtime(start)[1] / 1000000
  start = process.hrtime()
  return(seconds + 's, ' + ms.toFixed(precision) + 'ms')
}

// Initialization of Question Bank
const initializeQuestionBank = () => {
  for (let x = 0; x < questionBankTotal; x++) {
    const questionBankIndex = x
    const first = Math.floor(Math.random() * 2) // Relevance
    const second = Math.floor(Math.random() * 5) + 1 // Frequency
    const third = Math.floor(Math.random() * 10) + 1 // Difficulty
    const questionBankChecked = 0
    const questionBankUsed = 0
    const temp = [questionBankIndex, first, second, third, questionBankChecked, questionBankUsed]
    questionBank.push(temp)
  }
}

// Initialization of Percentage
const initializePercentage = () => {
  let questionBankUsedCounter = 0
  for (let x = 0; x < questionBankTotal; x++) {
    if (questionBank[x][5] == 1) {
      questionBankUsedCounter += 1
    }
  }
  
  const percentage = 1.0 / (questionBankTotal - questionBankUsedCounter)
  const questionBankPercentage = []

  for (let x = 0; x < questionBankTotal; x++) {
    if (questionBank[x][5] != 1) {
      questionBankPercentage.push(percentage)
    } else {
      questionBankPercentage.push(0.0)
    }
  }

  return questionBankPercentage
}

const resetQuestionBankUsed = () => {
  for (let x = 0; x < questionBankTotal; x++) {
    questionBank[x][5] = 0
  }
}

// Helper function to compensate for lack of random.choices() in JS stdlib
const randomChoice = (p) => {
  let rnd = p.reduce((a, b) => a + b) * Math.random()
  let result = p.findIndex(a => (rnd -= a) < 0)

  if (result < 0) result = 0
  return result
  //return p.findIndex(a => (rnd -= a) < 0)
}

// ABC Algorithm
const getQuestionsABC = (questionBankPercentage, questionnaireItemQuantity) => {
  const questionnaireOutputABC = [] // Questionnaire list
  let questionsRetrievedABC = 0 // Number of retrieved questions
  let questionnaireTotalABC = questionnaireItemQuantity // Target number of questions in questionnaire
  let difficultyAdjust = 0.6 // Adjusting difficulty
  let questionQualityThreshholdABC = 80 // Initialize question quality threshold
  let questionCheckedCounterABC = 0
  let abcCounterIterations = 0

  while (questionsRetrievedABC < questionnaireTotalABC) {
    const employedBees = questionBank[randomChoice(questionBankPercentage)]

    const relevancePercentage = (employedBees[1] * 25) + 20
    const frequencyPercentage = (employedBees[2] * 5) + 10
    const difficultyPercentage = (employedBees[3] * 1) + 10
    const questionQualityABC = relevancePercentage + frequencyPercentage + difficultyPercentage

    if (questionQualityABC >= questionQualityThreshholdABC) {
      questionnaireOutputABC.push(employedBees)
      questionsRetrievedABC += 1

      for (let x = 0; x < questionBankTotal; x++) {
        if (x != employedBees[x] && questionBankPercentage[x] != 0.0) {
          questionBankPercentage[x] = (questionBankPercentage[employedBees[0]] / (questionBankTotal - questionsRetrievedABC)) + questionBankPercentage[x]
          questionBank[employedBees[0]][5] = 1 // Used for flagging questions that have been used
        }
      }
      questionBankPercentage[employedBees[0]] = 0.0
    }

    employedBees[4] = 1
    for (let x = 0; x < questionBankTotal; x++) {
      if (questionBank[x][4] == 1) {
        questionCheckedCounterABC += 1
      }
    }

    if (questionsRetrievedABC == (questionnaireItemQuantity * difficultyAdjust) || questionCheckedCounterABC == questionBankTotal) {
      questionQualityThreshholdABC -= 20
      difficultyAdjust += 0.3
    }

    questionCheckedCounterABC = 0
    abcCounterIterations += 1

    let questionBankUsedChecker = 1
    for (x = 0; x < questionBankTotal; x++) {
      if (questionBank[x][5] == 1) {
        questionBankUsedChecker += 1
      }
    }

    if (questionBankUsedChecker == questionBankTotal) {
      resetQuestionBankUsed()
    }
  }

  return questionnaireOutputABC
}

const generateQuestionnaireABC = async (questionnaire_quantity, num_of_questions, subject, start_date, difficulty) => {

  try {
    const currentDate = new Date(new Date().toISOString())
    const startDate = new Date(start_date)
    console.log(currentDate)
    console.log(startDate)

    const questions = await Question.find({ 
      subject: subject, 
      difficulty: difficulty,
      date_created: {
        $gte: startDate,
        $lt: currentDate
      }
    })

    questionSetQuantity = questionnaire_quantity
    questionnaireItemQuantity = num_of_questions
    questionBankTotal = questions.length
    questionBank = []

    initializeQuestionBank()
    const questionnaires = []
    const answer_list = []
    const benchmarks = []

    // questionnaire iteration
    for (let x = 0; x < questionSetQuantity; x++) {
      const questionnaire_temp = []
      const answer_list_temp = []
      const benchmarks_temp = []
      timeHelper()
      console.time('test')

      const questionnaireBankPercentage = initializePercentage()
      const questionnaireOutputABC = getQuestionsABC(questionnaireBankPercentage, questionnaireItemQuantity) 

      for (let y = 0; y < questionnaireItemQuantity; y++) {
        const val = questions[questionnaireOutputABC[y][0]]
        questionnaire_temp.push(val._id)
        answer_list_temp.push(val.correct_answer)
      }
      
      const benchmark = timeHelper()
      console.timeEnd('test')
      benchmarks_temp.push(benchmark)
      benchmarks.push(benchmarks_temp)
      questionnaires.push(questionnaire_temp)
      answer_list.push(answer_list_temp)
    }

    //console.log(questionBank)
    return { questionnaires, answer_list, benchmarks }

  } catch (err) {
    throw new Error('DB Connection')
  }
}

module.exports = generateQuestionnaireABC
