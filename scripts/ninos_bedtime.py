"""Expand short saint stories into calm bedtime-length narratives (ES/EN)."""
import hashlib
import re


def _pick(key: str, options: list[str]) -> str:
    h = int(hashlib.md5(key.encode()).hexdigest(), 16)
    return options[h % len(options)]


def _sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def _elaborate_es(sentence: str, key: str) -> str:
    extras = [
        "Así lo contaban las abuelas junto al fuego, con voz bajita para no despertar a nadie.",
        "Los niños de entonces escuchaban con los ojos brillantes, sin prisa.",
        "No hacía falta correr: la historia iba despacio, como una nube perezosa.",
        "En el silencio de la noche, cada palabra caía suave, como una pluma.",
        "Quizás tú también, alguna vez, hayas sentido algo parecido en tu corazón.",
        "Dios miraba desde el cielo, contento, porque alguien hacía el bien con ternura.",
        "María, la Madre de Jesús, sonreía al ver tanto amor en acción.",
        "El viento afuera movía las hojas muy despacio, como si también escuchara.",
    ]
    questions = [
        "¿Te imaginas cómo sería estar allí, en esa noche tranquila?",
        "¿Has visto alguna vez a alguien hacer algo así por amor?",
        "A veces lo más pequeño es lo que más luce en la oscuridad.",
    ]
    return _pick(key, extras) + " " + _pick(key + "q", questions)


def _elaborate_en(sentence: str, key: str) -> str:
    extras = [
        "Grandmothers told it by the fire, in a hushed voice so no one would wake.",
        "Children listened with bright eyes, in no hurry at all.",
        "There was no need to rush: the story moved slowly, like a lazy cloud.",
        "In the quiet of night, each word fell softly, like a feather.",
        "Maybe you too have felt something like this in your heart.",
        "God looked from heaven, pleased, because someone did good with tenderness.",
        "Mary, the Mother of Jesus, smiled to see so much love in action.",
        "Outside, the wind moved the leaves very slowly, as if it were listening too.",
    ]
    questions = [
        "Can you imagine being there, on that peaceful night?",
        "Have you ever seen someone do something like that out of love?",
        "Sometimes the smallest thing shines brightest in the dark.",
    ]
    return _pick(key, extras) + " " + _pick(key + "q", questions)


def _intro_es(title: str) -> str:
    return (
        f"Esta noche, cuando las luces de la casa se van apagando una a una, "
        f"te invito a escuchar el cuento de {title}.\n\n"
        "Acomódate bien bajo las mantas. Puedes cerrar los ojos si quieres — "
        "solo escucha. Tu ángel de la guarda está aquí, sentado al lado de tu almohada, "
        "sin hacer ruido.\n\n"
        "Fuera, el mundo respira despacio. Las estrellas no tienen prisa: "
        "brillan, brillan, como pequeñas velitas en el cielo oscuro. "
        "Respira hondo… otra vez… Muy bien. Estás a salvo, y Dios te mira con mucho cariño."
    )


def _intro_en(title: str) -> str:
    return (
        f"Tonight, as the house lights go out one by one, "
        f"I invite you to hear the story of {title}.\n\n"
        "Get cozy under the blankets. You may close your eyes if you like — "
        "just listen. Your guardian angel is here, sitting beside your pillow, "
        "making no sound at all.\n\n"
        "Outside, the world breathes slowly. The stars are in no hurry: "
        "they shine and shine, like little candles in the dark sky. "
        "Breathe in… and out… Good. You are safe, and God is watching you with great love."
    )


def _pause_es(key: str) -> str:
    pauses = [
        "Calla un momentito el cuento. ¿Oyes? Es el silencio — un silencio bueno, de paz.",
        "Las estrellas parpadean afuera, como si también escucharan.",
        "Una respiración profunda… otra… Muy bien. La noche abraza la tierra como una manta tibia.",
        "Nada urge ahora. Mañana habrá luz; esta noche solo queda el cuento y tu corazón tranquilo.",
        "Un gato maúlla lejos, muy lejos, y luego todo vuelve a quedar quieto.",
        "La luna pone una luz suave, plateada, que no despierta a nadie.",
    ]
    return _pick(key, pauses)


def _pause_en(key: str) -> str:
    pauses = [
        "The story rests a moment. Do you hear? It is silence — a good silence, full of peace.",
        "The stars twinkle outside, as if they were listening too.",
        "A deep breath… another… Good. The night wraps the earth like a warm blanket.",
        "Nothing is urgent now. Tomorrow there will be light; tonight there is only the story and your quiet heart.",
        "A cat meows far away, very far, and then everything is still again.",
        "The moon casts a soft, silvery light that wakes no one.",
    ]
    return _pick(key, pauses)


def _outro_es(moral: str) -> str:
    return (
        f"Y así, poco a poco, llegamos al final de este cuento.\n\n"
        f"{moral}\n\n"
        "Recuerda: no tienes que ser perfecto para que Dios te quiera. "
        "Solo tienes que dejar que Él te cuide, como en este cuento.\n\n"
        "El mundo afuera sigue durmiendo. Los árboles descansan. "
        "La luna vigila tu ventana con una luz suave, sin hacer ruido.\n\n"
        "Cierra los ojos cuando quieras. Tu ángel se quedará velando. "
        "María reza por ti. Jesús te conoce por tu nombre.\n\n"
        "Buenas noches, pequeño. Buenas noches, pequeña. "
        "Que sueñes con cosas buenas. Descansa… descansa…"
    )


def _outro_en(moral: str) -> str:
    return (
        "And so, little by little, we reach the end of this story.\n\n"
        f"{moral}\n\n"
        "Remember: you do not have to be perfect for God to love you. "
        "You only need to let Him care for you, as in this story.\n\n"
        "The world outside keeps sleeping. The trees rest. "
        "The moon watches your window with a soft light, making no noise.\n\n"
        "Close your eyes whenever you wish. Your angel will stay on guard. "
        "Mary prays for you. Jesus knows you by name.\n\n"
        "Good night, little one. Good night. "
        "May you dream of good things. Rest… rest…"
    )


def expand_section_es(section: str, story_id: str, idx: int) -> list[str]:
    blocks = [_pick(f"{story_id}-open-{idx}", [
        "En aquel tiempo, lejos o cerca — da igual — sucedió algo hermoso.",
        "La historia comienza así, sin prisa, como empiezan los cuentos de noche.",
        "Escucha con calma; no hay prisa por llegar al final.",
    ])]
    sents = _sentences(section)
    for j, sent in enumerate(sents):
        blocks.append(sent)
        blocks.append(_elaborate_es(sent, f"{story_id}-{idx}-{j}"))
        blocks.append(_pick(f"{story_id}-detail-{idx}-{j}", [
            "Imagina la escena: luces tenues, pasos suaves, corazones que laten despacio.",
            "Nadie corre. Nadie grita. Solo el amor, moviéndose en silencio.",
            "Los adultos de entonces no entendían todo; pero los niños sí sentían la bondad.",
            "En cada rincón del cuento hay una enseñanza, como una semillita escondida.",
        ]))
    blocks.append(_pick(f"{story_id}-bridge-{idx}", [
        "El cuento respira un momento… y sigue.",
        "Cierra los ojos un segundo si quieres. La historia no se va.",
        "Tu manta te abraza. El cuento te abraza también.",
    ]))
    return blocks


def expand_section_en(section: str, story_id: str, idx: int) -> list[str]:
    blocks = [_pick(f"{story_id}-open-{idx}", [
        "In that time, far or near — it does not matter — something beautiful happened.",
        "The story begins like this, unhurried, as bedtime tales begin.",
        "Listen calmly; there is no rush to reach the end.",
    ])]
    sents = _sentences(section)
    for j, sent in enumerate(sents):
        blocks.append(sent)
        blocks.append(_elaborate_en(sent, f"{story_id}-{idx}-{j}"))
        blocks.append(_pick(f"{story_id}-detail-{idx}-{j}", [
            "Picture the scene: dim lights, soft steps, hearts beating slowly.",
            "No one runs. No one shouts. Only love, moving in silence.",
            "The grown-ups then did not understand everything; but children felt the goodness.",
            "In every corner of the story there is a lesson, like a hidden little seed.",
        ]))
    blocks.append(_pick(f"{story_id}-bridge-{idx}", [
        "The story breathes a moment… and goes on.",
        "Close your eyes a second if you wish. The tale will not leave.",
        "Your blanket holds you. The story holds you too.",
    ]))
    return blocks


def expand_bedtime(
    story_es: str,
    story_en: str,
    title_es: str,
    title_en: str,
    moral_es: str,
    moral_en: str,
    story_id: str,
) -> tuple[str, str, int]:
    """Return (story_es, story_en, read_minutes) for bedtime mode."""
    parts_es = [ _intro_es(title_es) ]
    parts_en = [ _intro_en(title_en) ]

    secs_es = [s.strip() for s in story_es.split("\n\n") if s.strip()]
    secs_en = [s.strip() for s in story_en.split("\n\n") if s.strip()]
    n = max(len(secs_es), len(secs_en))

    for i in range(n):
        if i < len(secs_es):
            for block in expand_section_es(secs_es[i], story_id, i):
                parts_es.append(block)
            parts_es.append(_pause_es(f"{story_id}-p-{i}"))
            if i == n // 2:
                parts_es.append(
                    "A mitad del cuento, todo queda muy quieto. "
                    "Como si el mundo entero guardara silencio para escucharte a ti. "
                    "No pasa nada malo. Solo paz. Solo calma."
                )
        if i < len(secs_en):
            for block in expand_section_en(secs_en[i], story_id, i):
                parts_en.append(block)
            parts_en.append(_pause_en(f"{story_id}-p-{i}"))
            if i == n // 2:
                parts_en.append(
                    "At the middle of the story, everything grows very still. "
                    "As if the whole world hushed to listen to you. "
                    "Nothing bad happens. Only peace. Only calm."
                )

    parts_es.append(_outro_es(moral_es))
    parts_en.append(_outro_en(moral_en))

    full_es = "\n\n".join(parts_es)
    full_en = "\n\n".join(parts_en)
    words = len(full_es.split())
    read_min = max(6, min(12, round(words / 90)))
    return full_es, full_en, read_min
