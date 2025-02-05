package com.g1AppDev.KnowledgeForge.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1AppDev.KnowledgeForge.Entity.StudentSelection;
import com.g1AppDev.KnowledgeForge.Repository.StudentSelectionRepository;

@Service
public class StudentSelectionService {

    @Autowired
    private StudentSelectionRepository studentSelectionRepository;

    public StudentSelection saveStudentSelection(StudentSelection studentSelection) {
        return studentSelectionRepository.save(studentSelection);
    }

    public List<StudentSelection> getStudentsByTutor(String tutorUsername) {
        return studentSelectionRepository.findByTutorUsername(tutorUsername);
    }

    public List<StudentSelection> getTutorsByStudent(String studentUsername) {
        return studentSelectionRepository.findTutorsByStudentUsername(studentUsername);
    }

    public void deleteStudentSelectionByTutorId(Long tutorId) {
        studentSelectionRepository.deleteByTutorId(tutorId);
    }

    public void acceptStudent(Long studentId, String tutorUsername) {
        StudentSelection selection = studentSelectionRepository.findById(studentId).orElseThrow();
        selection.setAccepted(true);
        studentSelectionRepository.save(selection);
    }

    public void declineStudent(Long studentId, String tutorUsername) {
        studentSelectionRepository.deleteById(studentId);
    }

    public boolean checkStudentAccess(String studentUsername, Long tutorId) {
        return studentSelectionRepository.existsByStudentUsernameAndTutorIdAndAccepted(studentUsername, tutorId, true);
    }
}