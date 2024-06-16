import pygame
import asyncio
from gemini import get_model

# Constants
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
FONT_SIZE = 32
MAX_MESSAGES = 10  # Maximum number of messages to display
MODEL = get_model()

class TextBox:
    def __init__(self, rect, color, font, text=''):
        self.rect = pygame.Rect(rect)
        self.color = color
        self.font = font
        self.text = text
        self.txt_surface = self.font.render(text, True, self.color)
        self.active = False

    def handle_event(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if self.rect.collidepoint(event.pos):
                self.active = not self.active
            else:
                self.active = False
            self.color = RED if self.active else BLACK
        if event.type == pygame.KEYDOWN:
            if self.active:
                if event.key == pygame.K_RETURN:
                    message = self.text
                    self.text = ''
                    self.txt_surface = self.font.render(self.text, True, self.color)
                    return message
                elif event.key == pygame.K_BACKSPACE:
                    self.text = self.text[:-1]
                else:
                    self.text += event.unicode
                self.txt_surface = self.font.render(self.text, True, self.color)
        return None

    def draw(self, screen):
        screen.blit(self.txt_surface, (self.rect.x + 5, self.rect.y + 5))
        pygame.draw.rect(screen, self.color, self.rect, 2)

async def main():
    pygame.init()
    size = (700, 500)
    screen = pygame.display.set_mode(size)
    pygame.display.set_caption("Arcade Style Chatbot")

    font = pygame.font.Font(None, FONT_SIZE)
    input_box = TextBox((300, 400, 140, 32), BLACK, font)
    messages = {}

    clock = pygame.time.Clock()
    done = False

    while not done:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = True
            new_message = input_box.handle_event(event)
            if new_message:
                messages[new_message] = None
                if len(messages) > MAX_MESSAGES:
                    messages.pop(0)

        screen.fill(WHITE)
        input_box.draw(screen)

        # Draw chat messages
        y_offset = 20
        for message in messages:
            if messages[message] is None:
                output_msg = MODEL.generate_content(message).text
                messages[message] = output_msg
            else:
                output_msg = messages[message]
            msg_surface = font.render(output_msg, True, BLACK)
            screen.blit(msg_surface, (20, y_offset))
            y_offset += FONT_SIZE + 5

        pygame.display.flip()
        clock.tick(60)
        await asyncio.sleep(0)

    pygame.quit()

if __name__ == "__main__":
    asyncio.run(main())
