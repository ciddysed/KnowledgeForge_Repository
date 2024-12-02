package com.g1AppDev.KnowledgeForge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1AppDev.KnowledgeForge.Entity.Tutor;
import com.g1AppDev.KnowledgeForge.Repository.TutorRepo;

@Service
public class TutorService {

    private final TutorRepo tutorRepository;

    @Autowired
    public TutorService(TutorRepo tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    // Register (Create Tutor)
    public Tutor registerTutor(Tutor tutor) {
        // Optional: You could add logic here to check if the username or email already exists
        return tutorRepository.save(tutor);
    }

    // Login (Find Tutor by Username and Password)
    public Optional<Tutor> loginTutor(String username, String password) {
        return tutorRepository.findByUsernameAndPassword(username, password);
    }

    // Find by ID
    public Optional<Tutor> findTutorById(int id) {
        return tutorRepository.findById(id);
    }

    // Find All Tutors
    public List<Tutor> findAllTutors() {
        return tutorRepository.findAll();
    }

    // Update Tutor
    public Tutor updateTutor(int id, Tutor updatedTutor) {
        Optional<Tutor> existingTutor = tutorRepository.findById(id);
        if (existingTutor.isPresent()) {
            Tutor tutor = existingTutor.get();
            tutor.setTutorName(updatedTutor.getTutorName());
            tutor.setEmail(updatedTutor.getEmail());
            tutor.setUsername(updatedTutor.getUsername());
            tutor.setPassword(updatedTutor.getPassword()); // Optional: Encrypt password
            tutor.setCourseMajor(updatedTutor.getCourseMajor());
            tutor.setCity(updatedTutor.getCity());
            tutor.setAge(updatedTutor.getAge());
            tutor.setDegrees(updatedTutor.getDegrees());
            return tutorRepository.save(tutor);
        }
        return null;
    }

    // Delete Tutor
    public boolean deleteTutor(int id) {
        if (tutorRepository.existsById(id)) {
            tutorRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
