package com.mirror.server.service;

import com.mirror.server.entity.Styles;
import com.mirror.server.repository.StylesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StylesService implements CommandLineRunner {

    @Autowired
    private StylesRepo Repo;

    @Override
    public void run(String... args) throws Exception {
        List<Styles> styles = List.of(
                new Styles("friendly", "Ton amical, proche"),
                new Styles("sarcastic", "Ton ironique et moqueur"),
                new Styles("serious", "Ton formel et professionnel"),
                new Styles("romantic", "Ton affectueux et émotionnel"),
                new Styles("funny", "Ton humoristique et léger"),
                new Styles("reflective", "Ton calme et profond"),
                new Styles("informative", "Donne des faits clairs"),
                new Styles("youth/meme", "Style jeune et viral"),
                new Styles("formal", "Langage poli et soigné"),
                new Styles("neutral", "Ton standard sans émotion"),
                new Styles("emotional", "Exprime les sentiments"),
                new Styles("inquisitive", "Pose des questions"),
                new Styles("commanding", "Donne des ordres"),
                new Styles("didactic", "Explique clairement"),
                new Styles("empathetic", "Comprend l’émotion"),
                new Styles("motivational", "Encourage et booste"),
                new Styles("poetic", "Ton artistique et imagé"),
                new Styles("annoyed", "Exprime l’agacement"),
                new Styles("skeptical", "Exprime le doute"),
                new Styles("philosophical", "Explore le sens profond"),
                new Styles("dramatic", "Exagère les émotions"),
                new Styles("spiritual", "Parle de foi et d’âme"),
                new Styles("narrative", "Raconte une histoire"),
                new Styles("passive-aggressive", "Critique indirectement"),
                new Styles("urgent", "Situation critique"),
                new Styles("persuasive", "Convainc ou influence"),
                new Styles("ambiguous", "Ton flou et mystérieux"),
                new Styles("confident", "Ton sûr de lui"),
                new Styles("hesitant", "Exprime l’hésitation"),
                new Styles("childish", "Ton naïf et mignon"),
                new Styles("dark", "Ton dramatique et pessimiste")
        );

        for (Styles style : styles) {
            boolean exists = Repo.existsByName(style.getName());
            if (!exists) {
                Repo.save(style);
                System.out.println("Inserted: " + style.getName());
            } else {
                System.out.println("Skipped (already exists): " + style.getName());
            }
        }
    }

}
