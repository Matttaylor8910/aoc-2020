import {readFile} from '../../common/file';

interface CustomsDeclarationForm {
  questions: {
    // the number of people on the form that answered yes to this question
    [key: string]: number;
  };
  people: number;
}

function partOne(forms: CustomsDeclarationForm[]) {
  // For each group, count the number of questions to which anyone answered
  // "yes". What is the sum of those counts?
  return forms.map(line => Object.keys(line.questions).length)
      .reduce((a, b) => a + b);
}

function partTwo(forms: CustomsDeclarationForm[]) {
  // For each group, count the number of questions to which everyone answered
  // "yes". What is the sum of those counts?
  return forms
      .map(form => {
        return Object.keys(form.questions)
            .filter(key => form.questions[key] === form.people)
            .length;
      })
      .reduce((a, b) => a + b);
}

function parseInput(): CustomsDeclarationForm[] {
  let forms: CustomsDeclarationForm[] = [];
  let questions = {};
  let people = 0;

  readFile().forEach(line => {
    if (line === '') {
      forms.push({questions, people});
      questions = {};
      people = 0;
    } else {
      people++;  // each line is one person
      for (const char of line.split('')) {
        questions[char] = (questions[char] || 0) + 1;
      }
    }
  });

  return forms;
}

const forms = parseInput();
console.log(partOne(forms));
console.log(partTwo(forms));