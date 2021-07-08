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

// ACO Algorithm
const getQuestionsACO = (questionBankPercentage, questionnaireItemQuantity) => {
  const questionnaireOutputACO = [] // Questionnaire list
  let questionsRetrievedACO = 0 // Number of retrieved questions
  let questionnaireTotalACO = questionnaireItemQuantity // Target number of questions in questionnaire
  let difficultyAdjust = 0.6 // Adjusting difficulty
  let questionQualityThreshholdACO = 80 // Initialize question quality threshold
  let questionCheckedCounterACO = 0
  let acoCounterIterations = 0

  while (questionsRetrievedACO < questionnaireTotalACO) {
    // Gets a random question from question bank based on weights
    const ant = questionBank[randomChoice(questionBankPercentage)]

    // Determines the quality of selected question
    const relevancePercentage = (ant[1] * 25) + 20
    const frequencyPercentage = (ant[2] * 5) + 10
    const difficultyPercentage = (ant[3] * 1) + 10
    const questionQualityACO = relevancePercentage + frequencyPercentage + difficultyPercentage

    // Question is inserted into questionnaire
    if (questionQualityACO > questionQualityThreshholdACO) {
      questionnaireOutputACO.push(ant)
      questionsRetrievedACO += 1

      // Adjusts pheromone level
      for (let x = 0; x < questionBankTotal; x++) {
        if (x != ant[0] && questionBankPercentage[x] != 0.0) {
          questionBankPercentage[x] = (questionBankPercentage[ant[0]] / (questionBankTotal - questionsRetrievedACO)) + questionBankPercentage[x]
          questionBank[ant[0]][5] = 1 // Used for flagging questions that have been used
        }
      }
      questionBankPercentage[ant[0]] = 0.0

    } else {
      // Adjusts pheromone level
      const subtrahendACO = questionBankPercentage[ant[0]] - (questionBankPercentage[ant[0]] * (questionQualityACO / 100))
      questionBankPercentage[ant[0]] -= subtrahendACO
      for (let x = 0; x < questionBankTotal; x++) {
        if (x != ant[0] && questionBankPercentage[x] != 0.0) {
          questionBankPercentage[x] = (subtrahendACO / (questionBankTotal - questionsRetrievedACO)) + questionBankPercentage[x]
        }
      }
    }
    
    ant[4] = 1
    for (let x = 0; x < questionBankTotal; x++) {
      if (questionBank[x][4] == 1) questionCheckedCounterACO += 1
    }

    if (questionsRetrievedACO == (questionnaireItemQuantity * difficultyAdjust) || questionCheckedCounterACO == questionBankTotal) {
      questionQualityThreshholdACO -= 20
      difficultyAdjust += 0.3
    }

    questionCheckedCounterACO = 0
    acoCounterIterations += 1
    let questionBankUsedChecker = 1
  
    for (let x = 0; x < questionBankTotal; x++) {
      if (questionBank[x][5] == 1) {
        questionBankUsedChecker += 1
      }
    }

    if (questionBankUsedChecker == questionBankTotal) {
      resetQuestionBankUsed()
    }
  }

  return questionnaireOutputACO
}

const generateQuestionnaireACO = async (questionnaire_quantity, num_of_questions, subject, start_date, difficulty) => {

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

    console.log(questions)

    questionSetQuantity = questionnaire_quantity
    questionnaireItemQuantity = num_of_questions
    questionBankTotal = questions.length
    questionBank = []

    console.log('Total number of questions in bank: ' + questionBankTotal)
    console.log('Number of questions needed: ' + num_of_questions)
    console.log(questions)

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
      const questionnaireOutputACO = getQuestionsACO(questionnaireBankPercentage, questionnaireItemQuantity) 

      for (let y = 0; y < questionnaireItemQuantity; y++) {
        const val = questions[questionnaireOutputACO[y][0]]
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
    return { questionnaires, answer_list, benchmarks }

  } catch (err) {
    throw new Error('DB Connection')
  }
}

module.exports = generateQuestionnaireACO
