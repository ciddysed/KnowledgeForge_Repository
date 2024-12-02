package com.g1AppDev.KnowledgeForge.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1AppDev.KnowledgeForge.Entity.Quiz;
import com.g1AppDev.KnowledgeForge.Repository.QuizRepo;

@Service
public class QuizService {

    

    @Autowired
    private final QuizRepo quizRepository;
    public QuizService(QuizRepo quizRepository) {
        this.quizRepository = quizRepository;
    }

    // Create
    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    // Find by ID
    public Optional<Quiz> findQuizById(int id) {
        return quizRepository.findById(id);
    }

    // Find All
    public List<Quiz> findAllQuizzes() {
        return quizRepository.findAll();
    }

    // Update
    public Quiz updateQuiz(int id, Quiz updatedQuiz) {
        Optional<Quiz> existingQuiz = quizRepository.findById(id);
        if (existingQuiz.isPresent()) {
            Quiz quiz = existingQuiz.get();
            quiz.setTitle(updatedQuiz.getTitle());
            return quizRepository.save(quiz);
        }
        return null;
    }

    // Delete
    public boolean deleteQuiz(int id) {
        if (quizRepository.existsById(id)) {
            quizRepository.deleteById(id);
            return true;
        }
        return false;
    }
}